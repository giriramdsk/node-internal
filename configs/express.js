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
  const modules = '/app/modules';
//   console.log('__dirname:', __dirname);
// try {
//   glob.sync('./app/modules/**/*Routes.js', {}, (err, files) => {
//     console.log("0000000000000000000000000")
//       files.forEach((route) => {
//         const stats = fs.statSync(route);
//         const fileSizeInBytes = stats.size;
//         if (fileSizeInBytes) {
//           require(route)(app, express);
//         }
//       });
//     });
// } catch (error) {
//   console.log(error,"testing")
// }
// require('/')
try {
  const routeFiles = glob.sync('./app/modules/**/*Routes.js');
  routeFiles.forEach(function (route) {
            const stats = fs.statSync(route);
        const fileSizeInBytes = stats.size;
        if (fileSizeInBytes) { 
    console.log(1111, route, 2222);

          require('../'+route)(app,express)  
          // require(route)(app, express); 
        }
  });
} catch (error) {
  console.error(error);
}


// require('../app/modules')
// const modulesDir = path.join(__dirname, 'app/modules');

  return app;
};
