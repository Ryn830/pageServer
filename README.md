# pageServer
> A static file server for Github files.

### Usage

```js
  var pageServer = require('pageServer');
  pageServer.serve(require('./config.json'), process.env['PORT'] || 3000);
```

### Example config.json

```json
  {
    "user": "FILL_ME_IN",
    "password": "FILL_ME_IN",
    "org": "FILL_ME_IN",
    "repo": "FILL_ME_IN"
  }
```

### Routes

* GET '/*' - Performs a `git show` on the file designated at `/BRANCH:FILE`.
  - ex. `/master:Home.md`
* POST '/update' - Performs a `git pull` on the repository listed in `config.json`
