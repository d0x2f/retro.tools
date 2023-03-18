# Contributing

Thank you for contributing!

## Getting started

Clone the project

```sh
$ git clone git@github.com:d0x2f/retro.tools.git
```

Install dependencies

```sh
$ npm install
```

Start a local development server

```sh
$ npm run dev
```

Changes you make will be reflected live at http://127.0.0.1:5173/.

## Testing

Tests are written using [cypress](https://cypress.io), please take the time to
write good tests for each new feature you add.
Test files are found in the `cypress/e2e` directory.

To open cypress, run:
```sh
$ npx cypress open
```

Alternatively, you can run the tests in headless mode with:
```sh
$ npx cypress run
```

## Backend

By default, this project is configured to run against a hosted development
backend.
This way you don't need to run a local copy of the backend or host your own
firestore database. Feel free to use and abuse it as you please, there are cloud
functions in place that will clean up old data and it's not a problem if it
breaks.

If you need to make changes to the backend, have a look at the repositories and
their documentation here:
- [d0x2f/retro.tools-backend](https://github.com/d0x2f/retro.tools-backend)
- [d0x2f/retro.tools-cloud-functions](https://github.com/d0x2f/retro.tools-cloud-functions)

## Translations

If you want to contribute a translation but aren't a coder, that's fine!
Take a look at the files in the `src/lang` directory and make a new one for your
target language.
Translate each entry in the file and submit a pull request with just your new
file, I'd appreaciate it a lot!
