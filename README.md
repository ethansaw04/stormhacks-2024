# BarcodeBytes

Introducing BarcodeBytes—the ultimate cooking hack for the broke college student who’s tired of eating instant noodles every day! With this app, you simply scan the barcodes of random foods lying around (yes, even that can of mystery beans you've had since freshman year). Using the magic of web scraping and the genius of OpenAI, BarcodeBytes will whip up a recipe from whatever bizarre combination of ingredients you have. Ramen, ketchup, a banana? No problem—BarcodeBytes’s got you covered with a gourmet (kinda) meal. Say goodbye to sad dorm room dinners and hello to culinary chaos!

## Try out our website!
[BarcodeBytes](https://sophiadt-frontend--3000.prod1a.defang.dev/)

*If it doesn't work then run `defang compose up` in the `scanerecipe` directory and pray the frontend somehow successfully deploys*

## ⚡ Usage

### Start backend
```shell
cd webscrape
python -m venv venv # or python3 -m venv venv
source venv/bin/activate # or venv\Scripts\activate if on windows
pip install requests beautifulsoup4 Flask flask-cors
python app.py # or python3 app.py
```

### Go back to the root directory
```shell
cd ..
```

### Install dependencies
```shell
cd scanecipe
npm install --global yarn
yarn install --frozen-lockfile
```

### Run React app
```shell
npm run start
```

### Running Docker
*Remember to add OpenAI key in `scanrecipe/src/components/openai.js` before you build*
```shell
docker compose build
docker compose up
```
