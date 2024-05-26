#!/bin/bash

# Change to the directory containing requirements.txt
cd "$(dirname "$0")/../flask_auth_app" || exit 1

# Set excutable
chmod +x ./flask_env.sh 

# Path to flask_env.sh
flask_env_sh="./flask_env.sh"

# Create an empty SQLite database
sqlite3 ./project/db.sqlite ""

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip
pip3 install -U pip

# Install requirements
pip install -r requirements.txt

# Source the environment variables
source "$flask_env_sh"
