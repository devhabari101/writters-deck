import os
import time
import logging
from pyngrok import ngrok

# Set ngrok authentication token
auth_token = "2dy4xv41828VmdgC9n2jNoN3NYE_7CJtTgmUtRVVPx8YpQpkP"
ngrok.set_auth_token(auth_token)

# Define the log file path
ngrok_log_file = "ngrok.log"

# Configure logging to both console and file
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(), logging.FileHandler(ngrok_log_file)])

# Start ngrok with logging enabled
try:
    ngrok.set_log_level(logging.INFO)
    ngrok.set_log_handler(logging.FileHandler(ngrok_log_file))
except Exception as e:
    logging.error(f"Failed to configure ngrok logging: {e}")

# Error handler
def open_ngrok_tunnel(port):
    while True:
        try:
            tunnel = ngrok.connect(port)
            logging.info(f'Public URL for port {port}: {tunnel.public_url}')
            time.sleep(12*60*60)  # Keep the HTTP tunnel open for 12 hours
        except KeyboardInterrupt:
            logging.info("\nExiting the script...")
            break
        except Exception as e:
            logging.error(f"Error opening ngrok tunnel for port {port}: {e}")
            logging.info("Retrying in 5 seconds...")
            time.sleep(5)


# Open a ngrok tunnel for port 3000
try:
    ngrok_tunnel_3000 = ngrok.connect(3000)
    logging.info(f'Public URL for port 3000: {ngrok_tunnel_3000.public_url}')
except Exception as e:
    logging.error(f"Failed to create ngrok tunnel for port 3000: {e}")

# Open a ngrok tunnel for port 7000
try:
    ngrok_tunnel_7000 = ngrok.connect(7000)
    logging.info(f'Public URL for port 7000: {ngrok_tunnel_7000.public_url}')
except Exception as e:
    logging.error(f"Failed to create ngrok tunnel for port 7000: {e}")

# Open an ngrok tunnel for SSH port 22
try:
    ngrok_tunnel_ssh = ngrok.connect(addr="2222", proto="tcp")
    logging.info(f'Public URL for SSH port 2222: {ngrok_tunnel_ssh.public_url}')
except Exception as e:
    logging.error(f"Failed to create ngrok tunnel for SSH port 2222: {e}")

# Keep the script running to keep the ngrok tunnels open
try:
    input("Press Enter to exit...")
except KeyboardInterrupt:
    logging.info("\nExiting the script...")
