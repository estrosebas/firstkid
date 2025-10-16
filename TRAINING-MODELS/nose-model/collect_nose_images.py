import os
import requests
import time
from urllib.parse import urlparse, urljoin
import hashlib

def download_image(url, folder, filename=None):
    """Download an image from URL and save it to folder"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Generate filename if not provided
        if not filename:
            # Create a hash-based filename
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            parsed = urlparse(url)
            ext = os.path.splitext(parsed.path)[1]
            if not ext:
                ext = '.jpg'
            filename = f"nose_bleeding_{url_hash}{ext}"
        
        filepath = os.path.join(folder, filename)
        
        # Skip if already exists
        if os.path.exists(filepath):
            print(f"Already exists: {filename}")
            return True
            
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"Downloaded: {filename}")
        return True
        
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")
        return False

# This script will be used in conjunction with Playwright
print("Image collection script ready. Use with Playwright to extract URLs.")