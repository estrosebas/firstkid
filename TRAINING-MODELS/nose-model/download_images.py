import requests
import os
import hashlib
from urllib.parse import urlparse

def download_image(url, output_dir):
    """Download an image from URL and save it to output directory"""
    try:
        print(f"Downloading: {url}")
        
        # Create a hash of the URL for unique filename
        url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
        
        # Set headers to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Try to determine file extension from URL or content-type
        parsed_url = urlparse(url)
        ext = os.path.splitext(parsed_url.path)[1]
        if not ext:
            content_type = response.headers.get('content-type', '')
            if 'jpeg' in content_type or 'jpg' in content_type:
                ext = '.jpg'
            elif 'png' in content_type:
                ext = '.png'
            elif 'webp' in content_type:
                ext = '.webp'
            else:
                ext = '.jpg'  # default
        
        filename = f"epistaxis_{url_hash}{ext}"
        filepath = os.path.join(output_dir, filename)
        
        # Check if file already exists
        if os.path.exists(filepath):
            print(f"File already exists: {filename}")
            return filepath
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"Successfully downloaded: {filename} ({len(response.content)} bytes)")
        return filepath
        
    except requests.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error with {url}: {e}")
        return None

def download_images_from_file(url_file, output_dir):
    """Download all images from URLs listed in a text file"""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    downloaded_count = 0
    failed_count = 0
    
    try:
        with open(url_file, 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        print(f"Found {len(urls)} URLs to download...")
        
        for url in urls:
            if download_image(url, output_dir):
                downloaded_count += 1
            else:
                failed_count += 1
        
        print(f"\nDownload complete!")
        print(f"Successfully downloaded: {downloaded_count} images")
        print(f"Failed downloads: {failed_count} images")
        print(f"Images saved to: {output_dir}")
        
    except FileNotFoundError:
        print(f"Error: URL file '{url_file}' not found")
    except Exception as e:
        print(f"Error reading URL file: {e}")

if __name__ == "__main__":
    url_file = r"c:\Users\estro\Desktop\rcp-model\image_urls.txt"
    output_directory = r"c:\Users\estro\Desktop\rcp-model\nose-model"
    
    download_images_from_file(url_file, output_directory)