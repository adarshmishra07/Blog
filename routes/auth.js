const express = require('express')
const passport = require('passport')
const router = express.Router()

//authenticate with google

router.get('/google', passport.authenticate('google',{scope:['profile']}))


//google auth call back

router.get('/google/callback' , passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    res.redirect('/dashboard')
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  
module.exports = router