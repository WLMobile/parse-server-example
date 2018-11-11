// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  appName : 'BaddaSushi',
  publicServerURL : process.env.SERVER_URL,
  emailAdapter: {
    module: 'parse-server-mailgun',
    options: {
      // The address that your emails come from
      fromAddress: 'gardenia_0809@hotmail.com',
      // Your domain from mailgun.com
      domain: 'sandboxde4f96b4c33f44588c02d62195ddb7cd.mailgun.org',
      // Your API key from mailgun.com
      apiKey: 'api:5dd330e7bc8a7241357be5854dc98889-4412457b-3e138ef5',
      verificationEmail: {
          subject: 'Confirm your account',
          pathPlainText: path.join(__dirname, '/public/verification_email.txt'),
          callback: (user) => { return { firstName: user.get('firstName') }}
          // Now you can use {{firstName}} in your templates
        },
      passwordResetEmail: {
          subject: 'Reset your password',
          pathPlainText: path.join(__dirname, '/public/verification_email.txt'),
          callback: (user) => { return { firstName: user.get('firstName') }}
          // Now you can use {{firstName}} in your templates
        },
      customEmailAlert: {
          subject: 'Urgent notification!',
          pathPlainText: path.join(__dirname, '/public/verification_email.txt')
        }
    }
  },
    verifyUserEmails: true
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website. ');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
