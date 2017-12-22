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

  var eventType = req.body.event.type;
  var messageUser = req.body.event.user || false;
  var messageChannel = req.body.event.channel;
  /**
   * #lunch: C7G1HCN0Z
   * @antonio: D40K69CQ5
   */
  var allowedChannels = ['C7G1HCN0Z'];

  if (messageUser && eventType === 'message' && allowedChannels.indexOf(messageChannel) > -1 ) {

    var messageText = req.body.event.text;
    var keyWords = [
      'Food', 'food',
      'Lunch', 'lunch', 'Lunch?', 'lunch?',
      'Thanks', 'thanks',
      'Thank you', 'thank you',
      'Maluch', 'maluch',
      'Good bye', 'good bye',
      'Bye bye', 'bye bye', 'Bye', 'bye'
    ];
    var lunchKeywords = ['Lunch', 'lunch', 'Lunch?', 'lunch?', 'Food', 'food'];

    if (keyWords.indexOf(messageText) < 0 ) {
      return res.status(200).end();
    }

    var requestData = { "text": 'Woof woof woof! :maluch_face: woof!'};
    if (lunchKeywords.indexOf(messageText) > -1 ) {
      var requestData = { "text": ':hotdog::pizza::taco::poultry_leg::hamburger::cake:... woof?'};
    }

    var url = process.env.SLACK_WEBHOOK_URL;

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
