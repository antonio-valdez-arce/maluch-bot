const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const http = require('http');
const app = express();
const request = require("request");

const port = process.env.PORT || 8080;

const barkAtKeywords = [
  'food',
  'lunch', 
  'thanks',
  'thank',
  'maluch', 
  'bye',
  'merci',
  'gracias'
];

const lunchKeywords = ['lunch', 'food', 'eat'];

function shouldBark(word) {
  return barkAtKeywords.includes(word.toLowerCase());
}

// body parser
app.use(bodyParser.json());

app.get('/', function (req, res) { res.status(200).send('Woof Woof!'); });
app.post('/listen', function (req, res, next) {
  
  const reqType = req.body.type;
  const userName = req.body.user_name;
  
  if (reqType === 'url_verification') {
    const challenge = {challenge: req.body.challenge}
    return res.status(200).json(challenge);
  }

  const eventType = req.body.event.type;
  const messageUser = req.body.event.user || false;
  const messageChannel = req.body.event.channel;
  /**
   * #lunch: C7G1HCN0Z
   * @antonio: D40K69CQ5
   */
  const allowedChannels = ['C7G1HCN0Z'];

  if (messageUser && eventType === 'message' && allowedChannels.indexOf(messageChannel) > -1 ) {

    const messageText = req.body.event.text;
    const barkAtWord = messageText.split(/[ ,?!]+/).find(shouldBark);
    
    if (!barkAtWord) {
      return res.status(200).end();
    }
    
    let woof = 'Woof woof woof! :maluch_face: woof!';
    if (lunchKeywords.includes(barkAtWord)) {
      woof = ':hotdog::pizza::taco::poultry_leg::hamburger::cake:... woof?';
    }

    const url = process.env.SLACK_WEBHOOK_URL;

    request({
      url: url,
      json: { "text": woof },
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
