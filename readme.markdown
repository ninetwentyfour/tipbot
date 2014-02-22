WARNING
====
This is meant to be good natured and fun. I wouldn't trust it's very secure, and I wouldn't open it up to the internet. For the love of god, DON'T PUT LARGE AMOUNTS OF COINS INTO YOUR WALLET

Created for use with https://gist.github.com/ninetwentyfour/9063547

INSTALL
====
Install dogecoind on the same machine as this app (http://www.dogeco.in/wiki/index.php/Dogecoind)

Download the source

npm install

set ENV vars

- TIPBOT_WALLET_PASS
- TIPBOT_DOGE_USER
- TIPBOT_DOGE_PASS
- TIPBOT_S3_KEY
- TIPBOT_S3_SECRET
- TIPBOT_AUTH_TOKEN

run with `node server.js` or `forever start -l forever.log -o out.log -e err.log server.js`

TODO
====

- moar security
- cache show calls with redis - prevent lots of doge lookups


API
====

###show
get
`/wallet/:id`

###history
get
`/wallet/:id/history`

###balance
get
`/wallet/:id/balance`

###register
get
`/wallet/:id/register`

###withdraw
get
`/wallet/:user/withdraw/:id`

###tip
post 
`/wallet/tip`
    
    body: {
      from,
      to,
      amount
    }


###backup
get
`/admin/wallet/backup`

###info
get
`/admin/wallet/info`

###accounts
get
`/admin/wallet/accounts`

