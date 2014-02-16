var dogecoin = require('node-dogecoin')();
var knox = require('knox');

dogecoin.auth(process.env.TIPBOT_DOGE_USER, process.env.TIPBOT_DOGE_PASS);

// display basic info about wallet
exports.info = function(req, res) {
  dogecoin.getInfo(function(err, info) {
    res.send({info: info});
  });
};

// list accounts in our wallet
exports.accounts = function(req, res) {
  dogecoin.listAccounts(function(err, accounts) {
    res.send({accounts: accounts});
  });
};

// backup the app wallet to s3 - TODO hit endpoint with cron or something
exports.backup = function(req, res) {
  var client = knox.createClient({
      key: process.env.TIPBOT_S3_KEY, 
      secret: process.env.TIPBOT_S3_SECRET, 
      bucket: 'tipbot-backups'
  });

  var time = new Date().getTime();
  var filename = 'wallet-' + time + '.dat';
  var path = '/tmp/' + filename;

  dogecoin.backupwallet(path, function(err, result) {
    client.putFile(path, '/' + filename, function(err, res){
      // Always either do something with `res` or at least call `res.resume()`.
      res.resume();
    });
  });
  res.send({backup: "ok"});
};
