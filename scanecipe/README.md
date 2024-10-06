## ⚡ Usage

### Start backend
```shell
cd ../webscrape
python -m venv venv # or python3 -m venv venv
source venv/bin/activate # or venv\Scripts\activate if on windows
pip install requests beautifulsoup4 Flask flask-cors
python app.py # or python3 app.py
```

### Install dependencies
```shell
cd ../scanecipe
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
cd scanecipe
docker compose build
docker compose up
```
