from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def scrape_go_upc(upc_code):
    # Search URL using the UPC code
    url = f"https://go-upc.com/search?q={upc_code}"

    # Set headers to mimic a browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    }

    # GET request to the URL with headers
    response = requests.get(url, headers=headers)

    # Log the full URL being requested
    print(f"Requesting URL: {url}")

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the product name in the body
        product_name = soup.find('h1', class_='product-name')
        
        if product_name:
            title = product_name.text.strip()
        else:
            # If not found in body, look for it inside the title tag
            title = soup.title.text.strip() if soup.title else 'N/A'

        return title  # Return only the title
    else:
        print(f"Failed to retrieve data for UPC: {upc_code}, Status Code: {response.status_code}")
        return None

# Root route to avoid 404 when accessing '/'
@app.route('/')
def home():
    return "Flask backend is running. Use /scrape with a valid UPC code to scrape data."

@app.route('/scrape', methods=['GET'])
def scrape():
    # Get UPC code from query parameters
    upc_code = request.args.get('upc')

    if not upc_code:
        return jsonify({'error': 'UPC code is required'}), 400

    # Call the scraping function
    title = scrape_go_upc(upc_code)

    if title:
        return jsonify({'title': title}), 200  # Return only the title in JSON
    else:
        return jsonify({'error': 'Failed to retrieve product title'}), 500

if __name__ == '__main__':
    # Set debug=False for production, keep host to 0.0.0.0 and port 5001
    app.run(host='0.0.0.0', port=5001)