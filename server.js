var express = require('express');
var wallets = require('./routes/wallets');
var admin = require('./routes/admin');

var dogecoin = require('node-dogecoin')({
  // im not super sure this is needed. seems like i have to call unlock manually anyway - can probably remove
  passphrasecallback: function(command, args, callback) {
    callback(null,  process.env.TIPBOT_WALLET_PASS, 30);
  }
});

// connect to the doge server
dogecoin.auth(process.env.TIPBOT_DOGE_USER, process.env.TIPBOT_DOGE_PASS);

var app = express();
// handle request body - mention ive seen to not use this
app.use(express.bodyParser());
app.disable('x-powered-by');

// things to do before any url
app.all('/*', function (req, res, next) {
  //always respond with json
  res.header("Content-Type", "application/json");

  // do a simple auth header check to prevent access - not very secure
  if(req.header("Authorization") == process.env.TIPBOT_AUTH_TOKEN){
    next();
  }else{
    return res.send({message: "Not Authorized"});
  }
});

// main endpoints - TODO dont use get for all endpoints
app.get('/wallet/:id', wallets.show);
app.get('/wallet/:id/history', wallets.history);
app.get('/wallet/:id/balance', wallets.balance);
app.get('/wallet/:id/register', wallets.register);
app.get('/wallet/:user/withdraw/:id', wallets.withdraw);
app.post('/wallet/tip', wallets.tip);

// admin endpoints - Nothing here is that bad if someone other than admin hits
app.get('/admin/wallet/backup', admin.backup);
app.get('/admin/wallet/info', admin.info);
app.get('/admin/wallet/accounts', admin.accounts);


// run a little webserver - its cute
var port = 3000;
app.listen(port);
console.log('Listening on port 3000...');
