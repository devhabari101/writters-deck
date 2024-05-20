import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Import markdown_dir

def list_trending_post():
    trending_post = None
    latest_date = None
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
                if metadata_dict.get('trending') == 'on':
                    post_date_str = metadata_dict.get('date')
                    if post_date_str:
                        post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                        if not latest_date or post_date > latest_date:
                            latest_date = post_date
                            html_content = markdown.markdown(content)
                            # Remove <p> tags from the HTML content
                            html_content = re.sub(r'<p>(.*?)</p>', r'\1', html_content)
                            trending_post = {
                                "metadata": metadata_dict,
                                "content": html_content
                            }
    return trending_post
