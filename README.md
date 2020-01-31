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
* Update `.env` with your githubm username `GITHUB_USE=your-github-username`
* Update `.env` with a repo to store notes in `GITHUB_REPO=your-repo-to-storen-notes-in`






## full .env should look somethin like this
```
  GITHUB_TOKEN=your-personal-github-token
  GITHUB_USER=your-github-username
  GITHUB_REPO=your-repo-to-storen-notes-in
  GITHUB_ADDITIONAL_REPO=hearsay.se
  PASSWORD=a-password-to-use-login-to-clear-notes
  EMAIL=an-mail-to-use-login-to-clear-notes
  TOKEN_SECRET=secret-used-to-hash-token
```


