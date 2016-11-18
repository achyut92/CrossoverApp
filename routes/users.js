var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');

/* GET users listing. */
router.get('/', function (req, res) {

    res.send('respond with a resource');
});


router.get('/profile-edit', function (req, res) {
    var user = req.user;
    res.render('profile-edit', {user:user});
});

router.get('/orders', function (req, res) {
    var user = req.user;
    Order.getAllOrdersByUser(user, function (err, orders) {
        if (err) throw err;

        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });

        res.render('orders', { user: user, orders: orders});
    });
});

router.get('/profile', isLoggedIn, function (req, res, next) {
    var user = req.user;
    var products = req.session.cart;

        res.render('profile', { title: 'Profile', user: user, products: products });
      
});

router.get('/register', function (req, res) {
    var errMsg = req.flash('error')[0];
    res.render('register', { title: 'Register', user: req.user, errMsg: errMsg, noError: !errMsg });
});

router.get('/login', function (req, res) {
    var errMsg = req.flash('error')[0];
    var products = req.session.cart;
    res.render('login', { title: 'Login', user: req.user, products: products, errMsg: errMsg, noError: !errMsg });
});


router.post('/registerUser',
    passport.authenticate('local.register', { failureRedirect: '/users/register', failureFlash: true }),
    function (req, res) {
        req.flash('success', 'Welcome ' + req.user.name);
        res.redirect('/');
    });

router.post('/loginUser',
    passport.authenticate('local.login', { failureRedirect: '/users/login', failureFlash: true, successRedirect: '/' }),
    function (req, res) {
        res.send();
    });

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password', 'Password should be minimum of 4 characters').isLength({ min: 4 });

    var errors = req.validationErrors();

    if (errors) {
        var message = [];
        errors.forEach(function (error) {
            message.push(error.msg);
        });
        return done(null, false, req.flash('error', message));
    }
    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (user) {
            return done(null, false, { message: 'Email already in use.' });
        }
        var newUser = new User({
            name: name,
            email: email,
            password: password
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            return done(null, newUser);
        });
      
    });

    }));


passport.use('local.login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, function (req, email, password, done) {
        console.log('LocalStrategy');

        req.checkBody('password', 'password field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password should be minimum of 4 characters').isLength({ min: 4 });

        var errors = req.validationErrors();

        if (errors) {
            var message = [];
            errors.forEach(function (error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', message));
        }
    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Email not found.' });
            //res.status(403).send();
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
                //res.send();
            } else {
                return done(null, false, { message: 'Oops.. Wrong Password.' });
                //res.status(403).send();
            }
        });
    });
    }));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}