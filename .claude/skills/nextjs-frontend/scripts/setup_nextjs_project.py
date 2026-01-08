#!/usr/bin/env python3
"""
Next.js 16+ Project Setup Script

This script helps automate the creation of a new Next.js 16+ project with recommended defaults.
It uses create-next-app with the --yes flag to set up a project with TypeScript, Tailwind CSS,
ESLint, App Router, and other recommended features.
"""

import os
import sys
import subprocess
import argparse


def create_nextjs_project(project_name, use_typescript=True, use_tailwind=True,
                         use_eslint=True, use_app_router=True):
    """
    Create a new Next.js 16+ project with recommended defaults
    """
    print(f"Creating Next.js 16+ project: {project_name}")

    # Check if the directory already exists
    if os.path.exists(project_name):
        print(f"Error: Directory '{project_name}' already exists!")
        return False

    # Build the command
    cmd = ["npx", "create-next-app@latest", project_name, "--yes"]

    try:
        print(f"Running command: {' '.join(cmd)}")
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)

        print("✅ Project created successfully!")
        print(result.stdout)

        # Navigate to the project directory and install additional dependencies if needed
        os.chdir(project_name)

        # Install additional recommended dependencies
        additional_deps = []
        if use_app_router:
            print("✅ App Router is enabled by default with --yes flag")

        print(f"✅ Next.js project '{project_name}' is ready!")
        print(f"📁 Directory structure created at: {os.path.abspath(project_name)}")
        print("\nTo start the development server:")
        print(f"  cd {project_name}")
        print("  npm run dev")

        return True

    except subprocess.CalledProcessError as e:
        print(f"❌ Error creating project: {e}")
        print(f"stdout: {e.stdout}")
        print(f"stderr: {e.stderr}")
        return False
    except FileNotFoundError:
        print("❌ Error: 'npx' command not found. Please ensure Node.js and npm are installed.")
        return False


def main():
    parser = argparse.ArgumentParser(description="Create a new Next.js 16+ project with recommended defaults")
    parser.add_argument("project_name", help="Name of the new Next.js project")
    parser.add_argument("--no-typescript", action="store_true", help="Skip TypeScript setup")
    parser.add_argument("--no-tailwind", action="store_true", help="Skip Tailwind CSS setup")
    parser.add_argument("--no-eslint", action="store_true", help="Skip ESLint setup")
    parser.add_argument("--no-app-router", action="store_true", help="Skip App Router setup")

    args = parser.parse_args()

    success = create_nextjs_project(
        args.project_name,
        use_typescript=not args.no_typescript,
        use_tailwind=not args.no_tailwind,
        use_eslint=not args.no_eslint,
        use_app_router=not args.no_app_router
    )

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()