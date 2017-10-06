## Keenethics Estimator

[![Known Vulnerabilities](https://snyk.io/test/github/keenethics/estimateit/badge.svg)](https://snyk.io/test/github/keenethics/estimateit)

A simple project estimation application. This program is designed to calculate tasks time for a project and create Google Spreadsheet / CSV reports.

![Estimator](https://preview.ibb.co/bNfua5/Screenshot_from_2017_06_21_18_56_36.png)
## Install

Development
```
git clone git@github.com:keenethics/estimateit.git && cd estimateit
npm i
npm run start    #Yes, ONE command for both server AND client development!
```

Production
```
npm run build
npm run serve
```
## Packages
* Webpack 2
* React
* Redux, Redux-forms
* Node.js
* Express.js
* MongoDB
* GraphQL, Apollo

# Deployment on Heroku
Install Heroku CLI & login: `heroku login`
Add a Heroku remote repo: `heroku git:remote -a estimator`
Deploy with npm script: `npm run deploy`

These valid Config Vars have to be provided:
```
BUNDLE_WITHOUT
GOOGLE_CALLBACK_URL
GOOGLE_CLIEN_ID
GOOGLE_CLIENT_SECRET
MAIL_API_KEY
MONGOLAB_ORANGE_URI
NPM_CONFIG_LOGLEVEL
PAPERTRAIL_API_TOKEN
SENTRY_DSN
```
