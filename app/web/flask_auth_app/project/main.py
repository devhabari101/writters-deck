import json
import os
from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user
from .auth import auth_blueprint  # Import the auth blueprint

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    # Construct the file path relative to the application root
    #json_file_path = os.path.join(current_app.root_path, 'markdown_output.json')
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    
    # Read data from markdown_output.json
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
    
    # Filter data for entries where trending, topPick, or popular is "on"
    filtered_data = [
        item for item in data
        if item['metadata'].get('trending') == 'on' or
           item['metadata'].get('topPick') == 'on' or
           item['metadata'].get('popular') == 'on'
    ]
    
    # Pass the filtered data to the template for rendering
    return render_template('index.html', data=filtered_data)

@main_blueprint.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
