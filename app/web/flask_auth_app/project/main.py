import os
import json
import markdown
from flask import Blueprint, render_template
from flask_login import login_required, current_user
from .auth import auth_blueprint  # Import the auth blueprint
from .features import get_filtered_data  # Import the get_filtered_data function
from .convertor import markdown_dir, convertor_blueprint
from .trending_post import get_latest_post, get_second_latest_post, list_all_trending_posts, list_latest_posts_by_category   # Import the functions
from .allnews import nget_latest_post, nget_second_latest_post, nget_fifth_latest_post
main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    # Construct the file path relative to the application root
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    
    # Read data from markdown_output.json
    try:
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        # Handle the case where the file doesn't exist
        data = []
        
    # Get the filtered data
    filtered_data = get_filtered_data()
    
    # Get the latest, second latest, and all trending posts
    latest_post = get_latest_post()
    second_latest_post = get_second_latest_post()
    trending_posts = list_all_trending_posts()
    all_latest_posts = list_latest_posts_by_category() # to remove this
    latest_news_post = nget_latest_post()
    second_latest_news_post = nget_second_latest_post()
    fifth_latest_news_post = nget_fifth_latest_post()
    
    print("Filtered Data:", filtered_data)
    print("Latest Post:", latest_post)
    print("Second Latest Post:", second_latest_post)
    print("Trending Posts:", trending_posts)
    
    # Filter data for entries where topPick or popular is "on"
    top_pick_count = 0
    popular_count = 0
    category_count = {}

    for item in data:
        if top_pick_count < 1 and item['metadata'].get('topPick') == 'on':
            filtered_data.append(item)
            top_pick_count += 1
        elif popular_count < 2 and item['metadata'].get('popular') == 'on':
            filtered_data.append(item)
            popular_count += 1
        # Update category count
        category = item['metadata'].get('category')
        if category:
            category_count[category] = category_count.get(category, 0) + 1
    
    # Pass the filtered data, latest post, second latest post, skipped post, and category count to the template for rendering
    return render_template('index.html', latest_news_post=latest_news_post, second_latest_news_post=second_latest_news_post, fifth_latest_news_post=fifth_latest_news_post, data=filtered_data, latest_post=latest_post, second_latest_post=second_latest_post, trending_posts=trending_posts, posts=filtered_data, category_count=category_count)



# Route for detailed Markdown page
@convertor_blueprint.route("/detail-page/<slug>")
def detail_page(slug):
    for filename in os.listdir(markdown_dir):
        if filename.endswith(".md"):
            with open(os.path.join(markdown_dir, filename), "r", encoding="utf-8") as file:
                markdown_content = file.read()
            metadata_match = re.match(r'^---(.*?)---(.*)', markdown_content, re.DOTALL)
            if metadata_match:
                metadata, content = metadata_match.groups()
                metadata_dict = {}
                for line in metadata.strip().split('\n'):
                    key_value = line.split(':', 1)
                    if len(key_value) == 2:
                        key, value = key_value
                        metadata_dict[key.strip()] = value.strip()
                if metadata_dict.get('slug') == slug:
                    html_content = markdown.markdown(content)
                    return render_template("detail_page.html", metadata=metadata_dict, content=html_content)
    abort(404)
