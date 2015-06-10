var asyncExec = require('q').denodeify(require('child_process').exec);
var shell = require('shelljs');
var _ = require('lodash');
var server = require('express')();

module.exports = {

  serve: function (config, port) {
    server.use(function (error, request, response, next) {
      if(!error) return next();
      console.error('Error: ', error.stack);
      response.status(500).send(error);
    });

    server.all('*', function (request, response, next) {
      response.header("Access-Control-Allow-Origin", "*");
      response.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
      response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      next();
    });

    server.get('/*', function (request, response) {
      var parsedUrl = request.url.split('%2F')[0].split(':');
      var branchToCheckout = parsedUrl[0].slice(1);
      var filePath = _.drop(parsedUrl, 1).join(':');
      var data = {};

      asyncExec('git --git-dir=' + shell.pwd() + '/.git show origin/' + branchToCheckout + ':' + filePath)
        .then(function (stdin) {
          data.body = stdin[0];
          data.status = 200;
          response.end(JSON.stringify(data, null, 2));
        }).catch(function (error) {
          console.error('There was a problem git showing ', branchToCheckout + ' ' + filePath, 'Error is: ', error);
          response.status(404).end("File Not Found");
        });
    });

    server.post('/update', function (request, response) {
      shell.exec('git pull --rebase origin test', function () {
        response.status(200).end("Success!\n");
      });
    });

    function initialize() {
      shell.exec('rm -rf ' + config.repo + ' && git clone https://' + config.user + ':' + config.password + '@github.com/' + config.org + '/' + config.repo + '.git', function () {
        shell.cd(config.repo);
        console.log('The working directory after initialization: ', shell.pwd());
      });
    }

    server.listen(port, '127.0.0.1', function () {
      console.log('Server start time: ', new Date());
      console.log('Listening on ', port);
      initialize();
    });

    return server;
  }
};
