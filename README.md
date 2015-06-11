# pageServer
> A static file server for Github files.

### Installation

`npm install git+https://github.com/Ryn830/pageServer.git`

### Usage

1. Export environment variables:
  - `export GITHUB_USERNAME=FILL_ME_IN`
  - `export GITHUB_PASSWORD=FILL_ME_IN`
  - `export GITHUB_REPO=FILL_ME_IN`
  - `export GITHUB_ORGANIZATION=FILL_ME_IN`

2. Require pageServer in server.js file
```js
  var pageServer = require('pageServer');
  pageServer.serve(process.env['PORT'] || 3000);
```

### Routes

* GET '/*' - Performs a `git show` on the file designated at `/BRANCH:FILE`.
  - ex. `/master:Home.md`
* POST '/update' - Performs a `git pull` on the repository referenced in exports.
