require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(session({secret: process.env.SESSIONSECRET,saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', './views')
app.set('view engine', 'pug')


const { check, validationResult} = require('express-validator');


const db = require('./queries')

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.get('/', function(req, res){
    var session = req.session;
    res.render('index', {title: "Hey", message: "Hello there!", username: session.username})
});

app.get('/register', function(req, res){
    res.render('register')
});

app.get('/worker/login', function(req, res){
    res.render('login_worker')
});

app.get('/login', function(req, res){
    res.render('login')
});

app.post('/register', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('pass').notEmpty().withMessage('Password is required'),
    check('repass').matches('pass').withMessage('Passwords do not match')
], function(req, res) {
    var errors = validationResult(req).array()
    if (errors) {
        res.render('register', {errors: errors})
    }else {
        db.createUser(req, res)
    }

});

app.post('/logout', function(req, res){
    var session = req.session;
    delete session.username
    console.log(session.username)
    res.render('index', {title: "Hey", message: "Hello there!", username: session.username})
})

app.post('/worker/login', [
    check('username').notEmpty().withMessage('Username is required'),
    check('pass').notEmpty().withMessage('Password is required')
],  function(req, res) {
    var errors = validationResult(req).array()
    if (errors) {
        res.render('login_worker', {errors: errors})
    }else {
        db.loginWorker(req, res)
    }

})

app.post('/login', [
    check('username').notEmpty().withMessage('Username is required'),
    check('pass').notEmpty().withMessage('Password is required')
],  function(req, res) {
    var errors = validationResult(req).array()
    if (errors) {
        res.render('login', {errors: errors})
    }else {
        db.loginUser(req, res)
    }

})
