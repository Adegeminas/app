process.env.NODE_ENV = 'development';
// test
const config = require('./config');
const log = require('./lib/log')(module);
const http = require('http');
const express = require('express');
const path = require('path');
// const sessionStore = require('./lib/sessionStore');

const app = express();

app.engine('ejs', require('ejs-locals'));

app.set('views', path.join(__dirname, '\\template'));
app.set('view engine', 'ejs');

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')());
// app.use(require('express-session')({
//   secret: config.get('session:secret'),
//   resave: false,
//   saveUninitialized: true,
//   key: config.get('session:key'),
//   cookie: config.get('session:cookie'),
//   store: sessionStore
// }));
app.use(require('./middleware/sendHttpError'));
// app.use(require('./middleware/loadUser'));

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middleware/errorHandler'));

const server = http.createServer(app).listen(process.env.PORT || config.get('port'), () => {
  log.info('Express server listening on port ' + (process.env.PORT || config.get('port')));
});

require('./socket')(server);
