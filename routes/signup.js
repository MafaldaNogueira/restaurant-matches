const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User');

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res) => {

  let { username, firstName, lastName, email, password } = req.body
  
  //Check if required fields aren't empty
  if(!username || !email || !password){
    res.render('auth/signup', { errorMessage: 'Indicate username, email and password' })
    return
  }

  try {
    
    //Check if user does not already exist
    const user = await User.findOne({ username })

    if(user !== null) {
      res.render('auth/signup', { message: 'The username already exists' })
      return
    }

    //Encrypt password 
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(password, salt);
    
    //Add new user to DB 
    const createdUser = await User.create({ username, firstName, lastName, email, password: hashedPass })
    res.redirect('/')
    
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
