var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account');
var forumRouter = require('./routes/forum');
var QuestionRouter = require('./routes/question');
var QueueRouter = require('./routes/queue');
var DashboardRouter = require('./routes/dashboard');
var cors = require('cors');
const bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/question', express.static(path.join(__dirname, 'uploads')));
// Set limits to handle larger payloads
app.use(bodyParser.json({ limit: '100mb' })); // Increase as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended: true, limit:'100mb'}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account', accountRouter);
app.use('/forum', forumRouter);
app.use('/qa', QuestionRouter);
app.use('/queue', QueueRouter);
app.use('/dashboard', DashboardRouter);


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
