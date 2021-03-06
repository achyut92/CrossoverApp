﻿var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://achyut:crossover@ds155097.mlab.com:55097/crossoverapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));


//Handle session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());

app.use('/', routes);
app.use('/users', users);
app.use('/products', products);

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    res.locals.session = req.session;
    
    next();
});


app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use(function (req, res, next) {
    req.db = db;
    next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: 'Error',
            user: req.user,
            products: req.session.cart,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: 'Error',
        user: req.user,
        products: req.session.cart,
        message: err.message,
        error: {}
    });
});




module.exports = app;
