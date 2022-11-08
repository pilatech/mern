const express = require('express');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const dbCon = require('./config/dbconfig');
const adminRoutes = require('./routes/admin')
const apiRoutes = require('./routes/api')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

require('dotenv').config()

const app = express();

/////connecting to database
dbCon()
.then(() => {
  console.log('Connected to DB')
})
.catch((err) => console.log(err))
///////////

app.set('trust proxy', 1)
app.use(rateLimiter({
 windowsMs: 15 * 60 * 100,
 max: 100
}))
//app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(methodOverride('_do'))

// app.use(cookieParser('agoodsecret'))
app.use(session({
  secret: process.env.SECRET || 'agoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  
}}));
app.use(flash());


// setting  up template variable
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.loggedInUser = req.session.user
  next()
})

//admin routes
app.use('/admin', adminRoutes)
app.get('/', (req, res) => {
  res.redirect('/admin/clients')
})

//api routes
app.use('/api', apiRoutes)

const port = process.env.PORT || 5500;

const start = async () => {
  await dbCon()
  app.listen(port, () => {
   console.log('listening on 5500');
 });
}

start()

