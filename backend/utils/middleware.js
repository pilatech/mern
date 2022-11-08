const jwt = require('jsonwebtoken')

module.exports.checkLogin = (req, res, next) => {
    if(!req.session.user){
      req.flash('error', 'You must login first')
      res.redirect('/admin/login')
    } else {
      next()
    }
  }

module.exports.checkAuthentication = (req, res, next) => {
 const token = req.headers["x-access-token"]
 if(!token) {
  return res.json({auth: false, message: 'Authentication failed!'})
 }

 jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
  if(err) {
   return res.json({auth: false, message: 'Authentication failed!'})
  }
  req.userId = decoded.id
  next()
 })
}