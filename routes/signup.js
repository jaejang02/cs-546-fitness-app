const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const users = require('../data/users');
const path = require('path');

router.get('/', async (req, res) => {
    if(req.session.user){
        return res.redirect('/protected');
      }
      else{
        return res.status(200).render('signup', {
            title : "Sign Up \• Jimbro",
            message : "this is the signup page lol",
            session : req.session.user
        });
      }
});

router.post('/', async (req, res) => {
    let username = req.body.usernameInput;
    let email = req.body.emailInput;
    let password = req.body.passwordInput;
    let confirmPassword = req.body.confirmPasswordInput;
    try {
      helpers.validateUsername(username);
      helpers.validateEmail(email);
      helpers.validatePassword(password);
      if (password !== confirmPassword) throw 'Error: Passwords do not match. Please try again.'
    } catch (e) {
      return res.status(400).render("../views/signup", { error : e });
    }
    try {
      let user = await users.createUser(username, email, password);
      console.log(user)
      if ((await user).insertedUser === false){
        console.log("u suck")
        return res.status(500).json("Internal Server Error");
      }
      return res.redirect('/login');
    } catch (e) {
      return res.status(400).render("../views/signup", { error : e });
    }
});

module.exports = router;