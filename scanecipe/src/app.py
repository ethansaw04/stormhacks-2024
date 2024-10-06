from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# Function to scrape product info from go-upc.com
def scrape_go_upc(upc_code):
    url = f"https://go-upc.com/search?q={upc_code}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    }

    # Perform GET request
    response = requests.get(url, headers=headers)

    # Log the full URL
    print(f"Requesting URL: {url}")

    # Check if request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract product name from 'h1' tag with class 'product-name'
        product_name = soup.find('h1', class_='product-name')

        # If not found in body, look for it inside the title tag
        if product_name:
            title = product_name.text.strip()
        else:
            title = soup.title.text.strip() if soup.title else 'N/A'

        # Extract product description from 'div' tag with class 'product-description'
        description = soup.find('div', class_='product-description').text.strip() if soup.find('div', class_='product-description') else 'N/A'

        # Extract product image URL from 'img' tag
        image_url = soup.find('img')['src'] if soup.find('img') else 'N/A'

        # Return product details
        return {
            'title': title,
            'description': description,
            'image_url': image_url
        }
    else:
        print(f"Failed to retrieve data for UPC: {upc_code}, Status Code: {response.status_code}")
        return None

# Route for scraping product data
@app.route('/scrape', methods=['POST'])
def scrape_product():
    data = request.get_json()
    upc_code = data.get('upc_code')

    # Ensure UPC code is provided
    if not upc_code:
        return jsonify({'error': 'UPC code is required'}), 400

    # Scrape product information
    product_info = scrape_go_upc(upc_code)

    if product_info:
        return jsonify(product_info)
    else:
        return jsonify({'error': 'Failed to retrieve product information'}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)