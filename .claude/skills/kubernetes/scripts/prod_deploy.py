#!/usr/bin/env python3
"""
Production Kubernetes Deployment Script

This script creates production-ready Kubernetes configurations with security,
resource management, health checks, and other production best practices.
"""

import subprocess
import sys
import argparse
import yaml
import os
from typing import Dict, Any, Optional, List


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


def create_production_deployment(
    name: str,
    image: str,
    replicas: int = 3,
    port: Optional[int] = None,
    env_vars: Optional[Dict[str, str]] = None,
    resources: Optional[Dict[str, str]] = None,
    health_checks: bool = True,
    security_context: bool = True,
    node_selector: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """Generate a production-ready Kubernetes Deployment YAML configuration."""

    deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': name,
            'labels': {
                'app': name,
                'environment': 'production'
            },
            'annotations': {
                'description': f'Production deployment for {name}'
            }
        },
        'spec': {
            'replicas': replicas,
            'strategy': {
                'type': 'RollingUpdate',
                'rollingUpdate': {
                    'maxSurge': '25%',
                    'maxUnavailable': '25%'
                }
            },
            'selector': {
                'matchLabels': {
                    'app': name
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': name,
                        'environment': 'production'
                    }
                },
                'spec': {
                    'containers': [
                        {
                            'name': name,
                            'image': image,
                            'imagePullPolicy': 'Always'  # For production, always pull latest
                        }
                    ]
                }
            }
        }
    }

    # Add ports if specified
    if port:
        deployment['spec']['template']['spec']['containers'][0]['ports'] = [
            {'containerPort': port}
        ]

    # Add environment variables if provided
    if env_vars:
        env_list = []
        for key, value in env_vars.items():
            env_list.append({'name': key, 'valueFrom': {
                'secretKeyRef': {
                    'name': f'{name}-secrets',
                    'key': key
                }
            }} if key.lower() in ['password', 'token', 'secret', 'key'] else {'name': key, 'value': value})

        deployment['spec']['template']['spec']['containers'][0]['env'] = env_list

    # Add resource limits if provided
    if resources:
        deployment['spec']['template']['spec']['containers'][0]['resources'] = resources

    # Add health checks
    if health_checks and port:
        deployment['spec']['template']['spec']['containers'][0]['livenessProbe'] = {
            'httpGet': {
                'path': '/health',
                'port': port
            },
            'initialDelaySeconds': 30,
            'periodSeconds': 10
        }
        deployment['spec']['template']['spec']['containers'][0]['readinessProbe'] = {
            'httpGet': {
                'path': '/ready',
                'port': port
            },
            'initialDelaySeconds': 5,
            'periodSeconds': 5
        }

    # Add security context
    if security_context:
        deployment['spec']['template']['spec']['securityContext'] = {
            'runAsNonRoot': True,
            'runAsUser': 1000,
            'fsGroup': 2000
        }
        deployment['spec']['template']['spec']['containers'][0]['securityContext'] = {
            'allowPrivilegeEscalation': False,
            'readOnlyRootFilesystem': True,
            'runAsNonRoot': True,
            'runAsUser': 1000,
            'capabilities': {
                'drop': ['ALL']
            }
        }

    # Add node selector if provided
    if node_selector:
        deployment['spec']['template']['spec']['nodeSelector'] = node_selector

    return deployment


def create_horizontal_pod_autoscaler(
    name: str,
    target_deployment: str,
    min_replicas: int = 2,
    max_replicas: int = 10,
    cpu_threshold: int = 70
) -> Dict[str, Any]:
    """Create a Horizontal Pod Autoscaler for the deployment."""

    hpa = {
        'apiVersion': 'autoscaling/v2',
        'kind': 'HorizontalPodAutoscaler',
        'metadata': {
            'name': f'{name}-hpa',
            'labels': {
                'app': name
            }
        },
        'spec': {
            'scaleTargetRef': {
                'apiVersion': 'apps/v1',
                'kind': 'Deployment',
                'name': target_deployment
            },
            'minReplicas': min_replicas,
            'maxReplicas': max_replicas,
            'metrics': [
                {
                    'type': 'Resource',
                    'resource': {
                        'name': 'cpu',
                        'target': {
                            'type': 'Utilization',
                            'averageUtilization': cpu_threshold
                        }
                    }
                }
            ]
        }
    }

    return hpa


def create_ingress(
    name: str,
    service_name: str,
    service_port: int,
    hostname: str,
    path: str = '/'
) -> Dict[str, Any]:
    """Create an Ingress resource for external access."""

    ingress = {
        'apiVersion': 'networking.k8s.io/v1',
        'kind': 'Ingress',
        'metadata': {
            'name': f'{name}-ingress',
            'labels': {
                'app': name
            },
            'annotations': {
                'kubernetes.io/ingress.class': 'nginx',
                'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
                'nginx.ingress.kubernetes.io/ssl-redirect': 'true'
            }
        },
        'spec': {
            'tls': [
                {
                    'hosts': [hostname],
                    'secretName': f'{name}-tls'
                }
            ],
            'rules': [
                {
                    'host': hostname,
                    'http': {
                        'paths': [
                            {
                                'path': path,
                                'pathType': 'Prefix',
                                'backend': {
                                    'service': {
                                        'name': service_name,
                                        'port': {
                                            'number': service_port
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }

    return ingress


def create_secret(name: str, secret_data: Dict[str, str]) -> Dict[str, Any]:
    """Create a Kubernetes Secret for sensitive data."""

    # Encode secrets in base64 (in a real implementation, this would be done properly)
    encoded_data = {k: v for k, v in secret_data.items()}  # Simplified for this example

    secret = {
        'apiVersion': 'v1',
        'kind': 'Secret',
        'metadata': {
            'name': f'{name}-secrets'
        },
        'type': 'Opaque',
        'data': encoded_data
    }

    return secret


def create_prod_deployment(
    name: str,
    image: str,
    replicas: int = 3,
    port: Optional[int] = None,
    env_vars: Optional[Dict[str, str]] = None,
    resources: Optional[Dict[str, str]] = None,
    namespace: str = 'default',
    create_hpa: bool = True,
    min_hpa_replicas: int = 2,
    max_hpa_replicas: int = 10,
    cpu_threshold: int = 70,
    create_ingress: bool = False,
    hostname: str = '',
    dry_run: bool = False
):
    """Create a production deployment with all associated resources."""

    print(f"Creating production deployment for {name}")

    # Create production deployment
    deployment = create_production_deployment(
        name=name,
        image=image,
        replicas=replicas,
        port=port,
        env_vars=env_vars,
        resources=resources
    )

    # Create HPA if requested
    hpa = None
    if create_hpa:
        hpa = create_horizontal_pod_autoscaler(
            name=name,
            target_deployment=name,
            min_replicas=min_hpa_replicas,
            max_replicas=max_hpa_replicas,
            cpu_threshold=cpu_threshold
        )

    # Create ingress if requested
    ingress = None
    if create_ingress and hostname:
        ingress = create_ingress(
            name=name,
            service_name=f'{name}-service',
            service_port=port or 80,
            hostname=hostname
        )

    # Create secret if environment variables contain sensitive data
    secrets = []
    if env_vars:
        sensitive_keys = [k for k in env_vars.keys() if k.lower() in ['password', 'token', 'secret', 'key']]
        if sensitive_keys:
            secret_data = {k: env_vars[k] for k in sensitive_keys}
            secret = create_secret(name, secret_data)
            secrets.append(secret)

    # Save all configurations to files
    files_to_create = []

    deployment_file = f"{name}_prod_deployment.yaml"
    with open(deployment_file, 'w') as f:
        yaml.dump(deployment, f, default_flow_style=False)
    files_to_create.append(deployment_file)

    if hpa:
        hpa_file = f"{name}_hpa.yaml"
        with open(hpa_file, 'w') as f:
            yaml.dump(hpa, f, default_flow_style=False)
        files_to_create.append(hpa_file)

    if ingress:
        ingress_file = f"{name}_ingress.yaml"
        with open(ingress_file, 'w') as f:
            yaml.dump(ingress, f, default_flow_style=False)
        files_to_create.append(ingress_file)

    for i, secret in enumerate(secrets):
        secret_file = f"{name}_secret_{i}.yaml"
        with open(secret_file, 'w') as f:
            yaml.dump(secret, f, default_flow_style=False)
        files_to_create.append(secret_file)

    print(f"Created production configuration files: {', '.join(files_to_create)}")

    # Apply configurations if not in dry-run mode
    if not dry_run:
        for file in files_to_create:
            cmd = f"kubectl apply -f {file} -n {namespace}"
            code, stdout, stderr = run_kubectl_command(cmd)
            if code != 0:
                print(f"Error applying {file}: {stderr}")
                # Clean up any created files
                for cleanup_file in files_to_create:
                    if os.path.exists(cleanup_file):
                        os.remove(cleanup_file)
                return False
            else:
                print(f"Applied {file} successfully")

        # Clean up temporary files
        for file in files_to_create:
            os.remove(file)

    return True


def main():
    parser = argparse.ArgumentParser(description='Create production Kubernetes deployments')
    parser.add_argument('--name', required=True, help='Name of the application')
    parser.add_argument('--image', required=True, help='Container image to deploy')
    parser.add_argument('--replicas', type=int, default=3, help='Number of replicas (default: 3)')
    parser.add_argument('--port', type=int, help='Container port')
    parser.add_argument('--namespace', default='default', help='Kubernetes namespace (default: default)')
    parser.add_argument('--create-hpa', action='store_true', help='Create Horizontal Pod Autoscaler')
    parser.add_argument('--min-hpa-replicas', type=int, default=2, help='Min replicas for HPA (default: 2)')
    parser.add_argument('--max-hpa-replicas', type=int, default=10, help='Max replicas for HPA (default: 10)')
    parser.add_argument('--cpu-threshold', type=int, default=70, help='CPU threshold for HPA (default: 70%)')
    parser.add_argument('--create-ingress', action='store_true', help='Create Ingress resource')
    parser.add_argument('--hostname', help='Hostname for ingress (required if --create-ingress)')
    parser.add_argument('--dry-run', action='store_true', help='Generate configs without applying them')

    # Environment variables
    parser.add_argument('--env', action='append', help='Environment variables in KEY=VALUE format')

    # Resource limits
    parser.add_argument('--cpu-limit', help='CPU limit (e.g., 500m)')
    parser.add_argument('--memory-limit', help='Memory limit (e.g., 1Gi)')
    parser.add_argument('--cpu-request', help='CPU request (e.g., 100m)')
    parser.add_argument('--memory-request', help='Memory request (e.g., 128Mi)')

    args = parser.parse_args()

    # Validate required args
    if args.create_ingress and not args.hostname:
        print("Error: --hostname is required when using --create-ingress")
        sys.exit(1)

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

    # Create the production deployment
    success = create_prod_deployment(
        name=args.name,
        image=args.image,
        replicas=args.replicas,
        port=args.port,
        env_vars=env_vars if env_vars else None,
        resources=resources if resources else None,
        namespace=args.namespace,
        create_hpa=args.create_hpa,
        min_hpa_replicas=args.min_hpa_replicas,
        max_hpa_replicas=args.max_hpa_replicas,
        cpu_threshold=args.cpu_threshold,
        create_ingress=args.create_ingress,
        hostname=args.hostname,
        dry_run=args.dry_run
    )

    if success:
        print(f"\nProduction deployment {args.name} created successfully!")
    else:
        print(f"\nProduction deployment failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()