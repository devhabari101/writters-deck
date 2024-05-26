#!/bin/bash

# Set Flask environment variables
export FLASK_APP=project
export FLASK_DEBUG=1

# Run Flask in the background
flask run --host=0.0.0.0 --port=7000 &

# Get the directory of the current script
script_dir="$(dirname "$(readlink -f "$0")")"

# Change to the directory containing the ngrok setup script
cd "$script_dir/../ngrok" || exit 1 

# Set executable permission for tunnel.sh
chmod +x ./tunnel.sh 

# Path to tunnel.sh
tunnel_sh="$script_dir/../ngrok/tunnel.sh"

# Execute tunnel.sh to perform additional setup after ngrok tunnels are started and ports are announced
/bin/bash "$tunnel_sh"
