#!/usr/bin/env python3
"""
Kubernetes Application Deployment Script

This script helps deploy containerized applications to Kubernetes clusters.
Supports both simple hello-world deployments and more complex production configurations.
"""

import subprocess
import sys
import argparse
import yaml
import os
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
    except Exception as e:
        return 1, "", str(e)


def create_deployment_yaml(
    name: str,
    image: str,
    replicas: int = 1,
    port: Optional[int] = None,
    env_vars: Optional[Dict[str, str]] = None,
    resources: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """Generate a Kubernetes Deployment YAML configuration."""

    deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': name,
            'labels': {
                'app': name
            }
        },
        'spec': {
            'replicas': replicas,
            'selector': {
                'matchLabels': {
                    'app': name
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': name
                    }
                },
                'spec': {
                    'containers': [
                        {
                            'name': name,
                            'image': image,
                            'ports': [{'containerPort': port}] if port else [],
                        }
                    ]
                }
            }
        }
    }

    # Add environment variables if provided
    if env_vars:
        env_list = []
        for key, value in env_vars.items():
            env_list.append({'name': key, 'value': value})
        deployment['spec']['template']['spec']['containers'][0]['env'] = env_list

    # Add resource limits if provided
    if resources:
        deployment['spec']['template']['spec']['containers'][0]['resources'] = resources

    return deployment


def create_service_yaml(name: str, port: int, target_port: int, service_type: str = 'ClusterIP') -> Dict[str, Any]:
    """Generate a Kubernetes Service YAML configuration."""

    service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': f'{name}-service',
            'labels': {
                'app': name
            }
        },
        'spec': {
            'selector': {
                'app': name
            },
            'ports': [
                {
                    'port': port,
                    'targetPort': target_port
                }
            ],
            'type': service_type
        }
    }

    return service


def deploy_application(
    name: str,
    image: str,
    replicas: int = 1,
    port: Optional[int] = None,
    service_port: Optional[int] = None,
    env_vars: Optional[Dict[str, str]] = None,
    resources: Optional[Dict[str, str]] = None,
    namespace: str = 'default',
    create_service: bool = True,
    dry_run: bool = False
):
    """Deploy an application to Kubernetes."""

    print(f"Preparing to deploy {name} using image {image}")

    # Create deployment YAML
    deployment = create_deployment_yaml(name, image, replicas, port, env_vars, resources)

    # Create service YAML if requested
    service = None
    if create_service and port:
        service_port = service_port or port
        service = create_service_yaml(name, service_port, port)

    # Save to temporary files
    deployment_file = f"{name}_deployment.yaml"
    with open(deployment_file, 'w') as f:
        yaml.dump(deployment, f, default_flow_style=False)

    print(f"Created deployment configuration: {deployment_file}")

    if service:
        service_file = f"{name}_service.yaml"
        with open(service_file, 'w') as f:
            yaml.dump(service, f, default_flow_style=False)
        print(f"Created service configuration: {service_file}")

        if not dry_run:
            # Apply service first
            cmd = f"kubectl apply -f {service_file} -n {namespace}"
            code, stdout, stderr = run_kubectl_command(cmd)
            if code != 0:
                print(f"Error applying service: {stderr}")
                return False
            else:
                print(f"Service {name}-service applied successfully")

    if not dry_run:
        # Apply deployment
        cmd = f"kubectl apply -f {deployment_file} -n {namespace}"
        code, stdout, stderr = run_kubectl_command(cmd)
        if code != 0:
            print(f"Error applying deployment: {stderr}")
            return False
        else:
            print(f"Deployment {name} applied successfully")

        # Clean up temporary files
        os.remove(deployment_file)
        if service:
            os.remove(service_file)

    return True


def scale_application(name: str, replicas: int, namespace: str = 'default'):
    """Scale an application to the specified number of replicas."""

    cmd = f"kubectl scale deployment {name} --replicas={replicas} -n {namespace}"
    code, stdout, stderr = run_kubectl_command(cmd)

    if code == 0:
        print(f"Successfully scaled {name} to {replicas} replicas")
        return True
    else:
        print(f"Error scaling application: {stderr}")
        return False


def check_deployment_status(name: str, namespace: str = 'default'):
    """Check the status of a deployment."""

    cmd = f"kubectl get deployment {name} -n {namespace} -o wide"
    code, stdout, stderr = run_kubectl_command(cmd)

    if code == 0:
        print("Deployment Status:")
        print(stdout)
        return True
    else:
        print(f"Error getting deployment status: {stderr}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Deploy applications to Kubernetes')
    parser.add_argument('--name', required=True, help='Name of the application')
    parser.add_argument('--image', required=True, help='Container image to deploy')
    parser.add_argument('--replicas', type=int, default=1, help='Number of replicas (default: 1)')
    parser.add_argument('--port', type=int, help='Container port')
    parser.add_argument('--service-port', type=int, help='Service port (defaults to container port)')
    parser.add_argument('--namespace', default='default', help='Kubernetes namespace (default: default)')
    parser.add_argument('--create-service', action='store_true', help='Create a service for the deployment')
    parser.add_argument('--dry-run', action='store_true', help='Generate configs without applying them')
    parser.add_argument('--scale', type=int, help='Scale the deployment to specified replicas')

    # Environment variables
    parser.add_argument('--env', action='append', help='Environment variables in KEY=VALUE format')

    # Resource limits
    parser.add_argument('--cpu-limit', help='CPU limit (e.g., 500m)')
    parser.add_argument('--memory-limit', help='Memory limit (e.g., 1Gi)')
    parser.add_argument('--cpu-request', help='CPU request (e.g., 100m)')
    parser.add_argument('--memory-request', help='Memory request (e.g., 128Mi)')

    args = parser.parse_args()

    # Parse environment variables
    env_vars = {}
    if args.env:
        for env_str in args.env:
            key, value = env_str.split('=', 1)
            env_vars[key] = value

    # Prepare resources if specified
    resources = {}
    limits = {}
    requests = {}

    if args.cpu_limit:
        limits['cpu'] = args.cpu_limit
    if args.memory_limit:
        limits['memory'] = args.memory_limit
    if args.cpu_request:
        requests['cpu'] = args.cpu_request
    if args.memory_request:
        requests['memory'] = args.memory_request

    if limits:
        resources['limits'] = limits
    if requests:
        resources['requests'] = requests

    # Check if we're scaling an existing deployment
    if args.scale is not None:
        success = scale_application(args.name, args.scale, args.namespace)
        if success:
            print(f"Scaling operation completed")
            sys.exit(0)
        else:
            print(f"Scaling operation failed")
            sys.exit(1)

    # Deploy the application
    success = deploy_application(
        name=args.name,
        image=args.image,
        replicas=args.replicas,
        port=args.port,
        service_port=args.service_port,
        env_vars=env_vars if env_vars else None,
        resources=resources if resources else None,
        namespace=args.namespace,
        create_service=args.create_service,
        dry_run=args.dry_run
    )

    if success:
        print(f"\nApplication {args.name} deployment initiated successfully!")

        if not args.dry_run:
            # Check the status
            check_deployment_status(args.name, args.namespace)
    else:
        print(f"\nApplication deployment failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()