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
      res.redirect('/login')
    })
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
            req.session.user = username;
            req.session.role = "user"
            res.redirect('/')
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
      res.redirect('/worker/login')
    })
}

const loginWorker = (req, res) => {
    const { username, pass } = req.body
    pool.query('Select username, password FROM workers WHERE username = $1 and password = $2', [username, pass],
    (error, results)=> {
        if (error) {
            throw error
        }
        if (results.rowCount == 1) {
            req.session.user = username;
            req.session.role = "admin"
            res.redirect('/admin')
        }
    })

}

module.exports = {
    createUser,
    loginUser,
    createWorker,
    loginWorker
  }