const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js')
const signin = require('./controllers/signin.js')
const image = require('./controllers/image.js');
const profile = require('./controllers/profile.js');
const leaderboard = require('./controllers/leaderboard.js')

const db = knex({
    client: 'pg',
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.select('*').from('users').then(data => { //don't need to convert to json because not http request
    console.log(data)
})

const app = express()
app.use(bodyParser.json());
app.use(cors())


app.get('/', (req, res) => {
    res.send('success')
})

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt, saltRounds) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) })

app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) })

app.post('/updateleaderboard', (req, res) => { leaderboard.updateLeaderboard(req, res, db) })

app.get('/leaderboard', (req, res) => { leaderboard.getLeaderboard(req, res, db) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`)
})