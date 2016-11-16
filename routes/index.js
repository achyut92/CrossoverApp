var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
    var successMsg = req.flash('success')[0];
    res.render('index', { title: 'Crossover', user: req.user, cart: req.session.cart, successMsg: successMsg, noMessage: !successMsg });
});

router.get('/about', function (req, res) {
    res.render('about', { title: 'About Crossover', user: req.user });
});

router.get('/contact', function (req, res) {
    res.render('contact', { title: 'Contact', user: req.user });
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login')
}

module.exports = router;