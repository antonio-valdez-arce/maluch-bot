var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 8080;

// body parser
app.use(bodyParser.json());

app.get('/', function (req, res) { res.status(200).send('Woof Woof!'); });

app.get('/listen', function (req, res) { res.status(200).send('Woof Woof!'); });

app.post('/listen', function (req, res, next) {
  
  var reqType = req.body.type;
  var userName = req.body.user_name;
  
  if (reqType === 'url_verification') {
    var challenge = {challenge: req.body.challenge}
    return res.status(200).json(challenge);
  }
  
  var post_data = querystring.stringify({
      'text' : 'Woof woof woof!'
  });
  
  var post_options = {
      host: 'hooks.slack.com',
      port: '80',
      path: '/services/T3ZEF9U2D/B8HD54588/ehLb3IUvhH8OgbrOFn7Y8quS',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  if (userName !== 'slackbot') {
    var post_req = http.request(post_options);

    // post the data
    post_req.write(post_data);
    post_req.end();
  } else {
    return res.status(200).end();
  }
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
