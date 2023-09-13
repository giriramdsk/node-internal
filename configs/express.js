/****************************
 EXPRESS AND ROUTING HANDLING
 ****************************/
const express = require('express'); 
var forceSSL = require('express-force-ssl');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors'); //For cross domain error
const fs = require('fs');
const path = require('path');
const timeout = require('connect-timeout');
const glob = require('glob');

const config = require('./configs');


module.exports = function () {
  console.log('env - ' + process.env.NODE_ENV)
  var app = express();

  // create a write stream (in append mode)
  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

  // setup the logger
  // app.use(morgan('combined', { stream: accessLogStream }))
  app.use(morgan(':remote-addr :method :url :status - :date', { stream: accessLogStream }));

  //console.log(__dirname)
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress({ threshold: 2 }));
  }

  app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
  }));

  app.use(bodyParser.json());
  morganBody(app, { logReqDateTime: false, logReqUserAgent: false, theme: 'dimmed', stream: accessLogStream });

  // Uncomment to force https
  // app.set('forceSSLOptions', {
  //   enable301Redirects: true,
  //   trustXFPHeader: false,
  //   httpsPort: 443,
  //   sslRequiredMessage: 'SSL Required.'
  // });
  // app.use(forceSSL);  

  app.use(methodOverride());

  app.use(cors());

  // =======   Settings for CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(timeout(120000));
  app.use(haltOnTimedout);

  function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
  }

  app.use((err, req, res, next) => {
    return res.send({
      status: 0,
      statusCode: 500,
      message: err.message,
      error: err
    });
  })

  // app.use(session({
  //   cookie: { maxAge: 30000 },
  //   saveUninitialized: true,
  //   resave: true,
  //   secret: config.sessionSecret
  // }));

  // app.use(express.json());

  // =======   Routing
  const modules = '/../app/modules';
//   const files = glob.sync(__dirname + modules + '/**/*Routes.js');
// require('../app/modules/User/Routes')(app,express)
  // files.forEach((route) => {
  //   console.log(route);
  
  //   const stats = fs.statSync(route);
  //   const fileSizeInBytes = stats.size;
  
  //   if (fileSizeInBytes) {
  //     try {
  //       require(route)(app, express);
  //     } catch (error) {
  //       console.error(`Error loading route file: ${route}`);
  //       console.error(error);
  //     }
  //   }
  // });
  // require('../app/modules/User/Routes')(app, express);

  // console.log(__dirname + modules + '/**/*Routes.js')
  glob.sync(__dirname + modules + '/*.js', {}, (err, files) => {
    // Rest of the code...
    console.error(files);

  });
  glob.sync(__dirname + modules + '/**/*Routes.js', {}, (err, files) => {
   if (err) {
      console.error('Error during glob file search:', err);
      return;
    }
   
    files.forEach((route) => {
      const stats = fs.statSync(route);
      const fileSizeInBytes = stats.size;
      if (fileSizeInBytes) {
        try {
          require(route)(app, express);
        } catch (error) {
          console.error('Error requiring route file:', error);
        }
      }
    });
  });

  return app;
};
