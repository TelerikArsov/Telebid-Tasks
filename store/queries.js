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
    const { username, pass } = req.body
    pool.query('Select id, username FROM users WHERE username = $1 and password = $2', [username, pass],
    (error, results)=> {
        if (error) {
            throw error
        }
        if (results.rowCount == 1) {
            req.session.user = username;
            req.session.role = "user"
            req.session.userId = results.rows[0]['id']  
        }
        res.redirect('/')
    })

}

var getUser = (req, callback) => {
    const username = req.session.user
    if (username) {
        pool.query('Select id, username, email FROM users WHERE username = $1 ', [username],
        (error, results)=> {
            if (error) {
                throw error
            }
            if (results.rowCount == 1) {
                callback(results.rows[0])
            }
        })
    }
}

const updateUser = (req, res) => {
    const { username, email, pass, newpass } = req.body
    const id = req.session.userId
    const newPassword = newpass == null ? pass : newpass;
    if(id){
        pool.query('UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 and password = $5',
        [username, email, newPassword, id, pass], (error, results) => {
            if (error) {
                throw error
            }
            req.session.user = username;
            res.redirect('/account')
        })
    }
    
}

// WORKERS

const createWorker = (req, res) => {
    if(req.session.user && req.session.role == "admin"){
        const { username, email, pass } = req.body
        pool.query('INSERT INTO workers (username, email, password, created_on) VALUES ($1, $2, $3, $4)',
        [username, email, pass, new Date().toISOString()], (error, results) => {
            if (error) {
                throw error
            }
            res.redirect('/admin')
        })
    }
}

const loginWorker = (req, res) => {
    const { username, pass } = req.body
    pool.query('Select id, username FROM workers WHERE username = $1 and password = $2', [username, pass],
    (error, results)=> {
        if (error) {
            throw error
        }
        if (results.rowCount == 1) {
            req.session.user = username;
            req.session.role = "admin"
            req.session.userId = results.rows[0]['id'];
            res.redirect('/admin')
        }
    })

}

//TAGS

function tcCreate(table, args){
    pool.query('INSERT INTO ' + table + ' (name, color, visible) VALUES ($1, $2, $3)',
    args, (error, results) => {
        if (error) {
            throw error
        }
    })
}
function getAll(req, res, table){
    pool.query('Select * FROM ' + table +' ;',
    (error, results)=> {
        if (error) {
            throw error
        }
        console.log(results.rows)
        res.json({table: table, result: results.rows})
    })
}

const createTag = (req, res) => {
    if(req.session.user && req.session.role == "admin"){
        console.log(req.body)
        const { name, color, visible } = req.body
        tcCreate('tags', [name, color, visible])
        getAll(req, res, 'tags')
    }
}
const createCategory = (req, res) => {
    if(req.session.user && req.session.role == "admin"){
        const { name, color, visible } = req.body
        tcCreate('categories', [name, color, visible])
        getAll(req, res, 'categories')
    }
}


module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser,
    createWorker,
    loginWorker,
    createTag,
    createCategory
  }