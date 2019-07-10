# Telegram Translator

- Translation docs: https://cloud.google.com/translate/docs/quickstart-client-libraries
- Telegram bot: https://medium.com/@xabaras/setting-your-telegram-bot-webhook-the-easy-way-c7577b2d6f72

- Create a bot with [BotFather](https://telegram.me/botfather).
	- Initiate new bot flow
		```
		/newbot
		```
	- Name the bot
		```
		translator
		```
	- Give the bot a user name
		```
		Internet9000EnBot
		```
	- Save the API token to the `telegram_token.txt` file in this repo.
- Setup the webhook
	- Find the httpsTrigger url
		```sh
		gcloud functions list
		gcloud functions describe translate
		```
	- Set the webhook
		```sh
		curl "https://api.telegram.org/bot$(cat telegram_token.txt)/setWebhook?url=https://us-central1-translator-246304.cloudfunctions.net/translate&allowed_updates=message"
		```


---

# Google Cloud Function Boilerplate

## Setup
- [Signup for Google Cloud](https://console.cloud.google.com)
- Create a new project project.
- Install the `gcloud` cli tool.
	```sh
	brew cask install google-cloud-sdk
	```
- Login
	```sh
	gcloud auth login
	```
- Find the project id you just created and set it as the current project.
	```sh
	gcloud projects list
	gcloud config set project translator-246304
	```

## Development
- Create a new service account
	```sh
	gcloud iam service-accounts create chet-dev
	```
- Add an owner policy
	```sh
	gcloud projects add-iam-policy-binding translator-246304 --member "serviceAccount:chet-dev@translator-246304.iam.gserviceaccount.com" --role "roles/owner"
	```
- Create the credentials file.
	```sh
	gcloud iam service-accounts keys create credentials.json --iam-account chet-dev@translator-246304.iam.gserviceaccount.com
	```
- Start the development server
	```sh
	npm start
	```
- Test that its working
	```sh
	curl curl http://localhost:8080/
	```

## Deploying
- [Read about it here](https://cloud.google.com/functions/docs/deploying/filesystem)
- Build the TypeScript files:
	```sh
	npm run build
	```
- Edit the package.json deploy script to reference the name of the function you want to deploy. Currently, it's called `translate`.
- Deploy
	```sh
	npm run deploy
	```
- The deployment should log an endpoint url that you can test.
	```sh
	curl https://us-central1-translator-246304.cloudfunctions.net/translate
	```

## Resources
- https://www.toptal.com/nodejs/serverless-nodejs-using-google-cloud
- https://cloud.google.com/functions/docs/writing/
- https://cloud.google.com/functions/docs/functions-framework