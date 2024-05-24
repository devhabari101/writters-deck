import json
from flask import render_template

def get_filtered_data():
    # Construct the file path relative to the application root
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    
    # Read data from markdown_output.json
    try:
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        # Handle the case where the file doesn't exist
        data = []
    
    # Sort data by date
    data.sort(key=lambda x: x['metadata']['date'], reverse=True)
    
    # Filter data for entries where trending, topPick, or popular is "on"
    filtered_data = []
    category_count = {}
    for item in data:
        category = item['metadata'].get('category')
        if category not in category_count:
            category_count[category] = 0
        if category_count.get(category, 0) < 1 and (
            item['metadata'].get('trending') == 'on' or 
            item['metadata'].get('topPick') == 'on' or 
            item['metadata'].get('popular') == 'on'
        ):
            filtered_data.append(item)
            category_count[category] += 1
    
    return filtered_data
