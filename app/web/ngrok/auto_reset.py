import subprocess
import time

# Define the log file path
log_file = "ngrok.log"

# Continuously monitor the log file for error messages
while True:
    # Open the log file
    with open(log_file, "r") as file:
        # Read each line in the log file
        for line in file:
            # Check if the line contains an error message
            if "ERROR" in line:
                # If an error is found, execute the desired file (e.g., tunnel.py)
                subprocess.Popen(["/bin/bash", "tunnel.py"])
                # Sleep for a while to prevent continuous execution
                time.sleep(60)  # Adjust the sleep time as needed
    # Sleep before checking the log file again
    time.sleep(60)  # Adjust the sleep time as needed
