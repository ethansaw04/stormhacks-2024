# Scanecipe

Introducing Scanecipe—the ultimate cooking hack for the broke college student who’s tired of eating instant noodles every day! With this app, you simply scan the barcodes of random foods lying around (yes, even that can of mystery beans you've had since freshman year). Using the magic of web scraping and the genius of OpenAI, Scanecipe will whip up a recipe from whatever bizarre combination of ingredients you have. Ramen, ketchup, a banana? No problem—Scanecipe’s got you covered with a gourmet (kinda) meal. Say goodbye to sad dorm room dinners and hello to culinary chaos!

## ⚡ Usage

### Start backend
```shell
cd ../webscrape
python -m venv venv
source venv/bin/activate #or venv\Scripts\activate if on windows
pip install -r requirements.txt
python app.py
```
*If `python -m venv venv` doesn't work try `python3 -m venv venv`*

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