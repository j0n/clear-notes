# Clear notes
A minimal notes app, using github as storage

## Setup
`git clone`

`cd clear-notes`

`npm i`

`cp env.sample .env`

## Github setup
* Create a personal access token to your github account https://github.com/settings/tokens
* Update `.env` with your personal token `GITHUB_TOKEN=your-personal-github-token`
* Update `.env` with your githubm username `GITHUB_USER=your-github-username`
* Update `.env` with a repo to store notes in `GITHUB_REPO=your-repo-to-storen-notes-in`

## Credential setup
Minimal fuzz credential.
Set a prefred username/email and password in your `.env` and a secret uses to encrypt your token
```
  PASSWORD=a-password-to-use-login-to-clear-notes
  EMAIL=an-mail-to-use-login-to-clear-notes
  TOKEN_SECRET=secret-used-to-hash-token
```

## full .env should look somethin like this
```
  GITHUB_TOKEN=your-personal-github-token
  GITHUB_USER=your-github-username
  GITHUB_REPO=your-repo-to-storen-notes-in
  PASSWORD=a-password-to-use-login-to-clear-notes
  EMAIL=an-mail-to-use-login-to-clear-notes
  TOKEN_SECRET=secret-used-to-hash-token
```

## Run app
`node .`

## Deploy to heroku
Setup heroku according to their guides.
Set the variables from `.env` as `Config Var`

