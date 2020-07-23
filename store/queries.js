require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
//USERS
const createUser = (req, res) => {
    const { username, email, pass } = req.body
    pool.query('INSERT INTO users (username, email, password, created_on) VALUES ($1, $2, $3, $4)',
    [username, email, pass, new Date().toISOString()], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`User added with ID: ${results.insertId}`)
    })
    validate(req, res)
}
// to refactor reasue code?
const loginUser = (req, res) => {
    var session = req.session;
    const { username, pass } = req.body
    pool.query('Select username, password FROM users WHERE username = $1 and password = $2', [username, pass],
    (error, results)=> {
        if (error) {
            throw error
        }
        if (results.rowCount == 1) {
            session.username = username;
            session.role = "user"
            res.render('index', {itle: "Hey", message: "Hello there!", username: username})
        }
    })

}

const createWorker = (req, res) => {
    const { username, email, pass } = req.body
    pool.query('INSERT INTO workers (username, email, password, created_on) VALUES ($1, $2, $3)',
    [username, email, pass, new Date().toISOString()], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`worker added with ID: ${results.insertId}`)
    })
}

const loginWorker = (req, res) => {
    var session = req.session;
    const { username, pass } = req.body
    pool.query('Select username, password FROM workers WHERE username = $1 and password = $2', [username, pass],
    (error, results)=> {
        if (error) {
            throw error
        }
        if (results.rowCount == 1) {
            session.username = username;
            res.render('admin_panel', {username: username})
        }
    })

}

module.exports = {
    createUser,
    loginUser,
    createWorker,
    loginWorker
  }