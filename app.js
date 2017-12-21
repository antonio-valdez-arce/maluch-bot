var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 8080;

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) { res.status(200).send('Woof Woof!'); });

app.get('/listen', function (req, res) { res.status(200).send('Woof Woof!'); });

app.post('/listen', function (req, res, next) {
  var userName = req.body.user_name;
  
  var botPayload = {
    text: 'Woof Woof Woof!'
  };

  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
