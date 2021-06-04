const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const auth = require('./app_server/middlewares/auth');
const env = require('./env');

// view engine setup
app.set('trust proxy', 1) 
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'ejs');

var sessionStore = new MySQLStore({
  host: env.MYSQLHOST,
  port: process.env.MYSQLPORT || env.MYSQLPORT,
  user: env.MYSQLUSER,
  password: env.MYSQLPWD,
  database: env.MYSQLDB
});

app.use(session({
  path:'/',
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: true
  }
}));

var bodyParser = require('body-parser');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/source/complete', auth.api_require_purchased, express.static(env.UPLOAD_AUDIO_COMPLETE));
app.use('/source/preview', express.static(env.UPLOAD_AUDIO_PREVIEW));
app.use('/source/album_cover', express.static(env.UPLOAD_ALBUM_COVER));
app.use('/source/artist_icon', express.static(env.UPLOAD_ARTIST_ICON));

var indexRouter = require('./app_server/routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);  

  //catch 404 and 403
  if(err.status === 404 || err.status === 403){
        res.locals.title = 'Error Page';
        res.locals.page = 'page_error';
        res.locals.user = req.session.user;
        res.locals.err = {
          code: err.status,
          title: err.status === 404 ? 'Page not found' : 'Forbidden',
          msg: ''
        };
        return res.render('template');
  }

  return res.render('error');
});

module.exports = app;
