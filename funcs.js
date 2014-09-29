var fs = require('fs');
var Twit = require('twit');

module.exports = (function(){
  global.get = function(url, cb){
    require('request')(url, function(e, r, b){
      (cb || console.log.bind(console))(e||b);
    });
  };
  global.btcbalance = function(addr, cb){ 
    get('https://blockchain.info/q/addressbalance/'+addr, cb);
  };
  global.btctx = function(txno, sendr_or_recvr, cb){
    get('https://blockchain.info/q/txresult/'+txno+'/'+sendr_or_recvr, cb);
  }; 
  global.btcqr = function(toaddr, btcamt, message, response_or_filename){
    var url = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=bitcoin:'+toaddr+'?amount='+btcamt+'&message='+message;
    if(typeof response_or_filename === 'string')
      response_or_filename = fs.createWriteStream(response_or_filename);
    require('request')(url).pipe(response_or_filename);
  }
  global.btcticker = function(){
    get('https://blockchain.info/ticker', cb);
  }
  global.btcsend = function(to, satoshi, note, cb){
    var auth = require('./config.json');
    get('https://blockchain.info/merchant/'+auth.btcwif+'/payment?to='+to+'&amount='+satoshi+'&note='+note, cb);
  }
  global.btcnewaddress = function(){
    var bitcoin = require('bitcoinjs-lib');
    var key = bitcoin.ECKey.makeRandom();
    return key.pub.getAddress().toString() + ';' + key.toWIF();
  }
  
  global.dumpdb = function(obj){
    obj && fs.writeFileSync('./db.json', JSON.stringify(obj, null, 2));
  }

  global.tweet = function(what, token, tsecret, cb){
    var auth = require('./config.json');
    if(token && tsecret){
      auth.access_token = token; auth.access_token_secret = tsecret;
    }
    var T = new Twit(auth);
    T.post('statuses/update', { status: what }, function(err, data, response) {
      (cb || console.log.bind(console))(data);
    });
  }
  global.retweet = function(id, token, tsecret, cb){
    var auth = require('./config.json');
    if(token && tsecret){
      auth.access_token = token; auth.access_token_secret = tsecret;
    }
    var T = new Twit(auth);
    T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
      (cb || console.log.bind(console))(data);
    })  
  }
  global.stream = function(what, cb){
    var auth = require('./config.json');
    var T = new Twit(auth);
    var stream = T.stream('statuses/filter', { track: what })
    stream.on('tweet', function (tweet) {
      (cb || console.log.bind(console))(tweet);
    })
  }

})();
