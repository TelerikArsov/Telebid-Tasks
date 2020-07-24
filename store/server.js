require('dotenv').config();
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(session({secret: process.env.SESSIONSECRET,
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', './views');
app.set('view engine', 'pug');


const { check, validationResult} = require('express-validator');


const db = require('./queries');

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.get('/', function(req, res){
    console.log(req.session.user)
    res.render('index', {title: "Hey", message: "Hello there!", username: req.session.user});
});

app.get('/register', function(req, res){
    res.render('register');
});

app.get('/worker/login', function(req, res){
    res.render('login_worker');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/admin', function(req, res){
    res.render('admin_panel', {username: req.session.user});
});
app.get('/admin/create_worker', function(req, res){
    res.render('register_worker');
});
app.get('/admin/create_tc', function(req, res){
    res.render('create_tc');
});


app.get('/account', function(req, res) {
    if(req.session.user){
        db.getUser(req, (prop) => res.render('account', prop));
    }
});

app.post('/register', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('pass').notEmpty().withMessage('Password is required').custom((value, {req}) => {
        if(value !== req.body.repass){
            throw new Error("Passwords do not match");
        }
        return true;
    })
], function(req, res) {
    handleErrors(req, res, db.createUser, 'register');
});

app.post('/account', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('pass').notEmpty().withMessage('Password is required'),
    check('newpass').custom((value, {req}) => {
        if(value !== req.body.repass){
            throw new Error("Passwords do not match");
        }
        return true;
    })
], function(req, res) {
    handleErrors(req, res, db.updateUser, 'account');
});

app.post('/logout', function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})

app.post('/worker/login', [
    check('username').notEmpty().withMessage('Username is required'),
    check('pass').notEmpty().withMessage('Password is required')
],  function(req, res) {
    handleErrors(req, res, db.loginWorker, 'login_worker');
});

app.post('/admin/create_worker', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('pass').notEmpty().withMessage('Password is required').custom((value, {req}) => {
        if(value !== req.body.repass){
            throw new Error("Passwords do not match");
        }
        return true;
    })
], function(req, res) {
    handleErrors(req, res, db.createWorker, 'register_worker');
});

app.post('/admin/tagCreate', [
    check('name').notEmpty().withMessage('Username is required'),
    check('color').notEmpty().withMessage('Color is required')
], function(req, res) {
    console.log(req.body)
    handleErrors(req, res, db.createTag, 'create_tc');
});

app.post('/login', [
    check('username').notEmpty().withMessage('Username is required'),
    check('pass').notEmpty().withMessage('Password is required')
],  function(req, res) {
    handleErrors(req, res, db.loginUser, 'login');
});


function handleErrors(req, res, callback, errorPage){
    var errors = validationResult(req).array()
    if (errors.length) {
        res.render(errorPage, {errors: errors})
    }else {
        try{
            callback(req, res);
        }catch (e) {
            console.log(e);
        }
        
    }
}