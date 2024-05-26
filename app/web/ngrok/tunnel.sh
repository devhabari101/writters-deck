#!/bin/bash

# Add environment variables to /etc/profile.d/pyenv.sh
echo 'export PYENV_ROOT="/opt/pyenv"' | tee -a /etc/profile.d/pyenv.sh >/dev/null
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' | tee -a /etc/profile.d/pyenv.sh >/dev/null
echo 'eval "$(pyenv init --path)"' | tee -a /etc/profile.d/pyenv.sh >/dev/null

# Source the profile to make the environment variables available
source /etc/profile.d/pyenv.sh

# Create virtual environment
/opt/pyenv/versions/3.10.0/bin/python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip3 install -U pip

# Install necessary packages
pip install pyngrok

# Execute Python script
python ./tunnel.py
