#!/bin/bash

# Exit if any command fails
set -e

# Install CMake if not already installed
if ! command -v cmake &> /dev/null; then
    apt-get update
    apt-get install -y --no-install-recommends wget gnupg
    wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc | apt-key add -
    apt-add-repository "deb https://apt.kitware.com/ubuntu/ jammy main" 
    apt-get update
    apt-get install -y cmake
fi

# Install additional dependencies if needed
apt-get install -y --no-install-recommends \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    llvm \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libffi-dev \
    supervisor

# Copy the supervisord configuration file
cp /web/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install pyenv if not already installed
if ! command -v pyenv &> /dev/null; then
    PYENV_ROOT="/opt/pyenv"
    curl https://pyenv.run | bash
    echo 'export PYENV_ROOT="/opt/pyenv"' >> /etc/profile.d/pyenv.sh
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> /etc/profile.d/pyenv.sh
    echo 'eval "$(pyenv init --path)"' >> /etc/profile.d/pyenv.sh
fi

# Activate pyenv
source /etc/profile.d/pyenv.sh || true  # Use 'true' to avoid script failure if sourcing fails

# Install Python 3.10 if not already installed
if ! pyenv versions | grep -q "3.10.0"; then
    pyenv install 3.10.0
    pyenv global 3.10.0
fi



# Start supervisord or any other services you need to run
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
