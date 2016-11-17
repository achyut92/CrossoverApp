var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
    var successMsg = req.flash('success')[0];
    var products = req.session.cart;
    res.render('index', { title: 'Crossover', user: req.user, products: products, successMsg: successMsg, noMessage: !successMsg });
});

router.get('/about', function (req, res) {
    var products = req.session.cart;
    res.render('about', { title: 'About Crossover', user: req.user, products: products });
});

router.get('/contact', function (req, res) {
    var products = req.session.cart;
    res.render('contact', { title: 'Contact', user: req.user, products: products });
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login')
}

module.exports = router;