#!/usr/bin/env python3
"""
Kubernetes Application Scaling Script

This script helps scale deployed applications up or down based on demand.
Supports manual scaling as well as automated scaling based on metrics.
"""

import subprocess
import sys
import argparse
import json
import time
from typing import Dict, Any, Optional


def run_kubectl_command(command: str, capture_output: bool = True) -> tuple:
    """Run a kubectl command and return the result."""
    try:
        if capture_output:
            result = subprocess.run(
                command, shell=True, capture_output=True, text=True, check=False
            )
            return result.returncode, result.stdout, result.stderr
        else:
            result = subprocess.run(command, shell=True, check=False)
            return result.returncode, "", ""


def get_current_replicas(name: str, namespace: str = 'default') -> Optional[int]:
    """Get the current number of replicas for a deployment."""

    cmd = f"kubectl get deployment {name} -n {namespace} -o jsonpath='{{.spec.replicas}}'"
    code, stdout, stderr = run_kubectl_command(cmd)

    if code == 0:
        try:
            return int(stdout.strip())
        except ValueError:
            print(f"Could not parse replica count: {stdout}")
            return None
    else:
        print(f"Error getting current replicas: {stderr}")
        return None


def scale_deployment(name: str, replicas: int, namespace: str = 'default') -> bool:
    """Scale a deployment to the specified number of replicas."""

    print(f"Scaling deployment {name} to {replicas} replicas in namespace {namespace}")

    cmd = f"kubectl scale deployment {name} --replicas={replicas} -n {namespace}"
    code, stdout, stderr = run_kubectl_command(cmd)

    if code == 0:
        print(f"Successfully initiated scaling of {name} to {replicas} replicas")
        return True
    else:
        print(f"Error scaling deployment: {stderr}")
        return False


def monitor_scaling_progress(name: str, target_replicas: int, namespace: str = 'default', timeout: int = 300) -> bool:
    """Monitor the scaling progress until it reaches the target."""

    print(f"Monitoring scaling progress for {name} (target: {target_replicas} replicas)")
    start_time = time.time()

    while time.time() - start_time < timeout:
        cmd = f"kubectl get deployment {name} -n {namespace} -o json"
        code, stdout, stderr = run_kubectl_command(cmd)

        if code == 0:
            try:
                deployment_data = json.loads(stdout)

                # Get current replica counts
                spec_replicas = deployment_data.get('spec', {}).get('replicas', 0)
                status_replicas = deployment_data.get('status', {}).get('replicas', 0)
                ready_replicas = deployment_data.get('status', {}).get('readyReplicas', 0)
                updated_replicas = deployment_data.get('status', {}).get('updatedReplicas', 0)

                print(f"  Spec: {spec_replicas}, Ready: {ready_replicas}, Updated: {updated_replicas}")

                # Check if scaling is complete
                if (ready_replicas == target_replicas and
                    updated_replicas == target_replicas and
                    status_replicas == target_replicas):
                    print(f"Scaling completed successfully! Deployment has {ready_replicas} ready replicas.")
                    return True

                # Check if scaling is progressing
                if ready_replicas >= target_replicas:
                    print(f"Scaling completed! Deployment has {ready_replicas} ready replicas.")
                    return True

            except json.JSONDecodeError:
                print("Error parsing deployment status JSON")

        time.sleep(10)  # Wait 10 seconds before checking again

    print(f"Timeout waiting for scaling to complete after {timeout} seconds")
    return False


def get_resource_usage(name: str, namespace: str = 'default') -> Dict[str, Any]:
    """Get resource usage for the deployment."""

    # Get CPU and memory usage
    cmd = f"kubectl top pods -n {namespace} --selector=app={name}"
    code, stdout, stderr = run_kubectl_command(cmd)

    if code == 0:
        print("Current resource usage:")
        print(stdout)
        return {'cpu_memory_usage': stdout}
    else:
        print(f"Could not get resource usage: {stderr}")
        return {}


def autoscale_based_on_load(cpu_threshold: float, memory_threshold: float,
                           min_replicas: int, max_replicas: int,
                           current_replicas: int, name: str, namespace: str = 'default') -> int:
    """Determine appropriate replica count based on current load."""

    # Get current resource usage
    cmd = f"kubectl top pods -n {namespace} --selector=app={name} --no-headers"
    code, stdout, stderr = run_kubectl_command(cmd)

    if code != 0:
        print(f"Could not get resource usage for autoscaling: {stderr}")
        return current_replicas

    # Parse the output to determine average CPU/Memory usage
    total_cpu = 0
    total_memory = 0
    pod_count = 0

    for line in stdout.strip().split('\n'):
        if line.strip():
            parts = line.split()
            if len(parts) >= 3:
                # Extract CPU and memory values (removing units like m, Ki, Mi)
                cpu_str = parts[1]
                mem_str = parts[2]

                cpu_val = 0
                mem_val = 0

                if cpu_str.endswith('m'):
                    cpu_val = int(cpu_str[:-1])
                elif cpu_str.isdigit():
                    cpu_val = int(cpu_str)

                if mem_str.endswith('Ki'):
                    mem_val = int(mem_str[:-2]) * 1024
                elif mem_str.endswith('Mi'):
                    mem_val = int(mem_str[:-2]) * 1024 * 1024
                elif mem_str.endswith('Gi'):
                    mem_val = int(mem_str[:-2]) * 1024 * 1024 * 1024
                elif mem_str.isdigit():
                    mem_val = int(mem_str)

                total_cpu += cpu_val
                total_memory += mem_val
                pod_count += 1

    if pod_count > 0:
        avg_cpu = total_cpu / pod_count
        avg_memory = total_memory / pod_count

        # Simple scaling algorithm based on thresholds
        # This is a simplified version - real HPA uses more sophisticated algorithms
        if avg_cpu > cpu_threshold or avg_memory > memory_threshold:
            # Scale up (but don't exceed max)
            new_replicas = min(max_replicas, current_replicas + max(1, current_replicas // 2))
            print(f"High load detected. Average CPU: {avg_cpu}m, Memory: {avg_memory/1024/1024:.2f}Mi. Scaling up to {new_replicas} replicas.")
        elif avg_cpu < cpu_threshold / 2 and avg_memory < memory_threshold / 2:
            # Scale down (but don't go below min)
            new_replicas = max(min_replicas, current_replicas - max(1, current_replicas // 4))
            print(f"Low load detected. Average CPU: {avg_cpu}m, Memory: {avg_memory/1024/1024:.2f}Mi. Scaling down to {new_replicas} replicas.")
        else:
            print(f"Load is within acceptable range. Maintaining {current_replicas} replicas.")
            return current_replicas

        return new_replicas

    return current_replicas


def main():
    parser = argparse.ArgumentParser(description='Scale Kubernetes applications')
    parser.add_argument('--name', required=True, help='Name of the deployment to scale')
    parser.add_argument('--replicas', type=int, help='Target number of replicas')
    parser.add_argument('--namespace', default='default', help='Kubernetes namespace (default: default)')
    parser.add_argument('--monitor', action='store_true', help='Monitor scaling progress')
    parser.add_argument('--timeout', type=int, default=300, help='Timeout for monitoring in seconds (default: 300)')
    parser.add_argument('--autoscale', action='store_true', help='Perform autoscaling based on current load')
    parser.add_argument('--cpu-threshold', type=float, default=70, help='CPU threshold percentage for autoscaling (default: 70)')
    parser.add_argument('--memory-threshold', type=float, default=100000000, help='Memory threshold in bytes for autoscaling (default: 100MB)')
    parser.add_argument('--min-replicas', type=int, default=1, help='Minimum replicas for autoscaling (default: 1)')
    parser.add_argument('--max-replicas', type=int, default=10, help='Maximum replicas for autoscaling (default: 10)')

    args = parser.parse_args()

    # Get current replica count
    current_replicas = get_current_replicas(args.name, args.namespace)
    if current_replicas is None:
        print(f"Could not get current replica count for {args.name}")
        sys.exit(1)

    print(f"Current replica count for {args.name}: {current_replicas}")

    target_replicas = args.replicas

    if args.autoscale:
        # Perform autoscaling based on current load
        target_replicas = autoscale_based_on_load(
            cpu_threshold=args.cpu_threshold,
            memory_threshold=args.memory_threshold,
            min_replicas=args.min_replicas,
            max_replicas=args.max_replicas,
            current_replicas=current_replicas,
            name=args.name,
            namespace=args.namespace
        )

        if target_replicas == current_replicas:
            print("No scaling needed based on current load.")
            sys.exit(0)
    elif target_replicas is None:
        print("Either --replicas or --autoscale must be specified")
        sys.exit(1)

    # Only proceed with scaling if the target is different from current
    if target_replicas != current_replicas:
        success = scale_deployment(args.name, target_replicas, args.namespace)

        if success:
            print(f"Scaling initiated: {current_replicas} -> {target_replicas} replicas")

            if args.monitor:
                monitor_scaling_progress(args.name, target_replicas, args.namespace, args.timeout)
        else:
            print("Scaling operation failed")
            sys.exit(1)
    else:
        print(f"Target replicas ({target_replicas}) equals current replicas ({current_replicas}), no scaling needed")


if __name__ == "__main__":
    main()