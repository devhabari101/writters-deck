# trending_post.py
import os
import json

def list_trending_post():
    trending_post = None
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
                    html_content = markdown.markdown(content)
                    trending_post = {
                        "metadata": metadata_dict,
                        "content": html_content
                    }
                    break  # Found a trending post, no need to continue searching
                else:
                    print(f"No trending post found in file: {filename}")
            else:
                print(f"Could not parse metadata in file: {filename}")
    return trending_post
