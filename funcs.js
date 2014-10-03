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
  global.blockchainticker = function(){
    get('https://blockchain.info/ticker', cb);
  }
  global.btcsend = function(to, satoshi, note, cb){
    var auth = require(process.cwd()+'/config.json');
    get('https://blockchain.info/merchant/'+auth.btcwif+'/payment?to='+to+'&amount='+satoshi+'&note='+note, cb);
  }
  global.btcnewaddress = function(){
    var bitcoin = require('bitcoinjs-lib');
    var key = bitcoin.ECKey.makeRandom();
    return key.pub.getAddress().toString() + ';' + key.toWIF();
  }
  global.exchangerate = function(from, to, cb){
    get('https://jsonp.nodejitsu.com?&url=http://rate-exchange.appspot.com/currency%3Ffrom%3D'+from+'%26to%3D'+to, cb);
    return;
  }
  global.btccticker = function(cb){
    get('https://data.btcchina.com/data/ticker?market=btccny', cb);
    return;
  }
  global.okcointicker = function(cb){
    get('https://www.okcoin.cn/api/ticker.do', cb);
    return;
  }
  global.bitstampticker = function(cb){
    get('https://www.bitstamp.net/api/ticker/', cb);
    return;
  }
  global.bitfinexticker = function(cb){
    get('https://api.bitfinex.com/v1/pubticker/BTCUSD', cb);
  }

  global.uberproducts = function(lat, long, cb){
    var auth = require(process.cwd() + '/config.json').uber_server_token;
    get('https://api.uber.com/v1/products?server_token='+token+'&latitude='+lat+'&longitude='+long, cb);
  }
  global.uberestimatetime = function(startlat, startlong, endlat, endlong){
    var auth = require(process.cwd() + '/config.json').uber_server_token;
    var qs = 'server_token='+token+'&start_latitude='+startlat+'&start_longitude='+startlong+'&end_latitude='+endlat+'&end_longitude='+endlong;
    get('https://api.uber.com/v1/estimates/time?' + qs, cb);
  }
  global.uberestimateprice = function(startlat, startlong, endlat, endlong){
    var auth = require(process.cwd() + '/config.json').uber_server_token;
    var qs = 'server_token='+token+'&start_latitude='+startlat+'&start_longitude='+startlong+'&end_latitude='+endlat+'&end_longitude='+endlong;
    get('https://api.uber.com/v1/estimates/price?' + qs, cb);
  }

  global.dumpdb = function(obj){
    obj && fs.writeFileSync('./db.json', JSON.stringify(obj, null, 2));
  }

  global.tweet = function(what, token, tsecret, cb){
    var dir = process.cwd() + '/config.json';
    var auth = require(dir);
    if(token && tsecret){
      auth.access_token = token; auth.access_token_secret = tsecret;
    }
    var T = new Twit(auth);
    T.post('statuses/update', { status: what }, function(err, data, response) {
      (cb || console.log.bind(console))(data);
    });
  }
  global.retweet = function(id, token, tsecret, cb){
    var auth = require(process.cwd()+'/config.json');
    if(token && tsecret){
      auth.access_token = token; auth.access_token_secret = tsecret;
    }
    var T = new Twit(auth);
    T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
      (cb || console.log.bind(console))(data);
    })  
  }
  global.stream = function(what, cb){
    var auth = require(process.cwd()+'/config.json');
    var T = new Twit(auth);
    var stream = T.stream('statuses/filter', { track: what })
    stream.on('tweet', function (tweet) {
      (cb || console.log.bind(console))(tweet);
    })
  }

})();
