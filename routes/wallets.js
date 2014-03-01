var dogecoin = require('node-dogecoin')();

dogecoin.auth(process.env.TIPBOT_DOGE_USER, process.env.TIPBOT_DOGE_PASS);

// show the wallet address for a user 
exports.show = function(req, res) {
  dogecoin.getaddressesbyaccount(req.params.id, function(err, address) {
    res.send({address: address[0]});
  });
};

// show the history of transactions for a user
exports.history = function(req, res) {
  dogecoin.listtransactions(req.params.id, function(err, transactions) {
    res.send({history: transactions});
  });
};

// show the balance for a user
exports.balance = function(req, res) {
  dogecoin.getbalance(req.params.id, function(err, result) {
    res.send({balance: result});
  });
};

// register a user
exports.register = function(req, res) {
  dogecoin.listAccounts(function(err, accounts) {
    if(Object.keys(accounts).indexOf(req.params.id) >= 0) {
      res.send({message: 'already registered'});
    }else{
      dogecoin.getNewAddress(req.params.id, function(err, address) {
        console.log(address);
      });
      res.send({message: 'account registered'});
    }
  });
};

// send coins from user to address
exports.withdraw = function(req, res) {
  var address = req.params.id;
  var user = req.params.user;
  console.log(user);

  dogecoin.getbalance(user, function(err, result) {
    console.log(result);
    var balance = result;
    // since we need to keep a couple coins for taxes if theres less than 2 just return
    if(balance < 2.0){
      return;
    }

    dogecoin.validateaddress(address, function(err, result) {
      // make sure the address they are withdrawing to is legit
      if (result.isvalid) {
        console.log('valid address');
        // unlock the wallet
        dogecoin.walletpassphrase(process.env.TIPBOT_WALLET_PASS, 30);
        // send them all their coins minus 2 for taxes
        dogecoin.sendfrom(user, address, (balance - 2.0), function(err, address) {
          console.log(err);
          console.log('move complete');
        });
      }
    });
  });

  res.send({message: "Funds withdrawn to " + address});
};

// tip from one user to another
// {"from": "example", "to": "test", "amount": "0.901"}
exports.tip = function(req, res) {
  var from = req.body.from;
  var to = req.body.to;
  var amount = parseFloat(req.body.amount);

  dogecoin.listAccounts(function(err, accounts) {
    if(Object.keys(accounts).indexOf(from) >= 0) {
      // the sender is a real user
      dogecoin.getbalance(from, function(err, result) {
        var balance = result;
        if(isNaN(balance) || parseFloat(balance) < amount){
          return res.send({message: 'not enough money'});
        }else{
          if(Object.keys(accounts).indexOf(to) >= 0) {
            // the reciever is registered
            dogecoin.move(from, to, amount, function(err, address) {
              console.log('move complete');
            });
          }else{
            // we need to register the reciever
            dogecoin.getNewAddress(to, function(err, address) {
              console.log(address);
              // now that new user has account, we can move
              dogecoin.move(from, to, amount, function(err, address) {
                console.log('move complete');
              });
            });
          }
        }
      });
    }else{
      // the sender of money needs to register first
      return res.send({message: 'please register and add coins first'});
    }
  });
};
