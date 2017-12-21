var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) { res.status(200).send('Woof Woof!'); });

app.post('/', function (req, res, next) {
  var userName = req.body.user_name;
  
  var botPayload = {
    text : 'Woof Woof Woof!'
  };

  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});
