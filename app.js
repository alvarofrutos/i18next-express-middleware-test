var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Localization
var i18next = require("i18next");
var i18back = require('i18next-node-fs-backend');
var i18midd = require("i18next-express-middleware");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Initialize i18next
i18next
  .use(i18back)
  .use(i18midd.LanguageDetector)
  .init({
    debug: true, // To be removed in production
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
    },
    fallbackLng: 'en',
    saveMissing: true,
    detection: {
      // Use cookies so the user selected language is kept
      caches: ['cookie'],
      cookieDomain: 'i18next-express-middleware-test'
    }
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use i18next
app.use(i18midd.handle(i18next, {
  removeLngFromUrl: false
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

module.exports = app;
