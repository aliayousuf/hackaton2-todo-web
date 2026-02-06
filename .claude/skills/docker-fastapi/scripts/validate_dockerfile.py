#!/usr/bin/env python3
"""
Docker best practices validator for Python/FastAPI applications

Validates Dockerfiles against common best practices for security and performance.
"""

import argparse
import re
from pathlib import Path


def validate_dockerfile(file_path):
    """Validate a Dockerfile against best practices."""

    with open(file_path, 'r') as f:
        content = f.read()

    issues = []
    recommendations = []

    # Check for non-root user creation
    if not re.search(r'(USER\s+\w+|RUN.*adduser.*--uid|RUN.*useradd)', content):
        issues.append("No non-root user defined. Using root user is a security risk.")
        recommendations.append("Create and switch to a non-root user with USER instruction.")

    # Check for multi-stage build
    if not re.search(r'AS\s+\w+', content):
        recommendations.append("Consider using multi-stage builds to reduce image size.")

    # Check for HEALTHCHECK
    if not re.search(r'HEALTHCHECK', content, re.IGNORECASE):
        recommendations.append("Add HEALTHCHECK instruction to monitor container health.")

    # Check for EXPOSE instruction
    if not re.search(r'EXPOSE\s+\d+', content, re.IGNORECASE):
        issues.append("No EXPOSE instruction found. Should expose application port.")

    # Check for minimal base image
    if re.search(r'FROM\s+python:\d+\.\d+', content) and not re.search(r'alpine|slim', content):
        recommendations.append("Consider using slim or alpine base images for smaller footprint.")

    # Check for package manager cleanup
    if not re.search(r'rm\s+-rf\s+/var/lib/apt/lists|apt-get\s+clean|apk\s+del', content):
        recommendations.append("Clean package manager cache to reduce image size.")

    # Check for .dockerignore reference (indirect check)
    has_dockerignore_comment = bool(re.search(r'dockerignore|#.*ignore', content, re.IGNORECASE))

    return {
        'issues': issues,
        'recommendations': recommendations,
        'has_dockerignore_comment': has_dockerignore_comment,
        'is_valid': len(issues) == 0
    }


def generate_dockerignore():
    """Generate a .dockerignore file for Python applications."""

    dockerignore_content = '''# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# Django stuff:
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal

# Flask stuff:
instance/
.webassets-cache

# Scrapy stuff:
.scrapy

# Sphinx documentation
docs/_build/

# PyBuilder
.pybuilder/
target/

# Jupyter Notebook
.ipynb_checkpoints

# IPython
profile_default/
ipython_config.py

# pyenv
#   For a library or package, you might want to ignore these files since the code is
#   intended to run in multiple environments; otherwise, check them in:
.python-version

# pipenv
#   According to pypa/pipenv#598, it is recommended to include Pipfile.lock in version control.
#   However, you may choose this safe option to not commit this file
#
#   However, if you want to include the Pipfile.lock file, you may choose this safe option to not commit this file
#   pipenv will generate it for you when you run `pipenv install`
#Pipfile.lock

# poetry
#   Similar to Pipfile.lock, it is generally recommended to include poetry.lock in version control.
#   This is especially recommended for binary packages to ensure reproducibility, and is more
#   commonly ignored for libraries.
#   https://python-poetry.org/docs/basic-usage/#commit-your-poetrylock-file-to-version-control
#
#   However, if you choose to ignore the lock file, uncomment the line below
#poetry.lock

# pdm
#   Similar to Pipfile.lock, it is generally recommended to include pdm.lock in version control.
#
#pdm.lock
#   pdm stores project-wide configurations in .pdm.toml, but you may intentionally
#   ignore it if this is a library
config/pdm.toml
.pyoxidizer.bzl

# PEP 582; used by e.g. github.com/David-OConnor/pyflow and github.com/pdm-project/pdm
__pypackages__/

# Celery stuff
celerybeat-schedule
celerybeat.pid

# SageMath parsed files
*.sage.py

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Spyder project settings
.spyderproject
.spyproject

# Rope project settings
.ropeproject

# mkdocs documentation
/site

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# Pyre type checker
.pyre/

# IDEs
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Environment specific files
.env.local
.env.development.local
.env.test.local
.env.production.local

# FastAPI specific
*.db
*.db-journal
'''

    return dockerignore_content


def main():
    parser = argparse.ArgumentParser(description="Validate Dockerfiles for FastAPI applications")
    parser.add_argument("--file", default="./Dockerfile", help="Path to Dockerfile to validate")
    parser.add_argument("--generate-dockerignore", action="store_true",
                        help="Generate .dockerignore file for Python applications")

    args = parser.parse_args()

    if args.generate_dockerignore:
        dockerignore_content = generate_dockerignore()
        with open('.dockerignore', 'w') as f:
            f.write(dockerignore_content)
        print(".dockerignore file generated successfully")
        return

    if not Path(args.file).exists():
        print(f"Error: Dockerfile not found at {args.file}")
        return

    validation_result = validate_dockerfile(args.file)

    print(f"\nDockerfile Validation Report for: {args.file}")
    print("=" * 50)

    if validation_result['issues']:
        print("\n❌ ISSUES FOUND:")
        for issue in validation_result['issues']:
            print(f"  • {issue}")

    if validation_result['recommendations']:
        print("\n💡 RECOMMENDATIONS:")
        for rec in validation_result['recommendations']:
            print(f"  • {rec}")

    if not validation_result['issues'] and not validation_result['recommendations']:
        print("\n✅ No issues found! Your Dockerfile follows best practices.")
    elif not validation_result['issues']:
        print("\n✅ No critical issues found!")

    print(f"\nOverall: {'✅ PASS' if validation_result['is_valid'] else '❌ NEEDS IMPROVEMENT'}")


if __name__ == "__main__":
    main()