var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');
var app = express();
var request = require("request");

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

  if (req.body.event.type === 'message' && typeof(req.body.event.user) !== 'undefined' ) {

    var messageUser = req.body.event.user;
    var messageChannel = req.body.event.channel;

    var requestData = { "text": `Woof Woof! ${messageChannel}`};
    var url = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';

    console.log(req.body);
  
    request({
      url: url,
      json: requestData,
      method: "POST",
      }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
              console.log(body)
              return res.status(200).end();
          }
          else {
              console.log("error: " + error)
              console.log("response.statusCode: " + response.statusCode)
              console.log("response.statusText: " + response.statusText)
              return res.status(500).end();
          }
      });
  
  } else {
    return res.status(200).end();
  }
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
