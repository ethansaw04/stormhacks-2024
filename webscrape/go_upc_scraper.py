import requests
from bs4 import BeautifulSoup

def scrape_go_upc(upc_code):
    # search URL using the UPC code
    url = f"https://go-upc.com/search?q={upc_code}"

    # set headers to mimic a browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    }

    #GET request to the URL with headers
    response = requests.get(url, headers=headers)

    # ;log the full URL being requested
    print(f"Requesting URL: {url}")

    # Check if the request was successful
    if response.status_code == 200:
        #parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        #find the product name in the body
        product_name = soup.find('h1', class_='product-name')
        
        if product_name:
            title = product_name.text.strip()
        else:
            # IF NOT FOUND IN BODY, LOOK FOR IT INSIDE THE TITLE TAG
            title = soup.title.text.strip() if soup.title else 'N/A'

        # extract product description if available
        description = soup.find('div', class_='product-description').text.strip() if soup.find('div', class_='product-description') else 'N/A'
        
        # extract product image URL
        image_url = soup.find('img')['src'] if soup.find('img') else 'N/A'

        return {
            'title': title,
            'description': description,
            'image_url': image_url
        }
    else:
        print(f"Failed to retrieve data for UPC: {upc_code}, Status Code: {response.status_code}")
        return None

if __name__ == '__main__':
    upc_code = input("Enter the UPC code: ")
    product_info = scrape_go_upc(upc_code)

    if product_info:
        print("Product Title:", product_info['title'])
        print("Product Description:", product_info['description'])
        print("Image URL:", product_info['image_url'])