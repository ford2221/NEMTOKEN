const router = require('express').Router();
const User = require('../models/User');

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

router.post('/register', async (req, res) => {

  //validating data

  const { error } = schemaRegister.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  //verifiying if the email already exist
  const existEmail = await User.findOne({email: req.body.email})
  if(existEmail) return res.status(400).json({error: true, message: 'Email already exists'})

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password
  });

  try {
    const userDb = await user.save();
    res.json({
      error: null,
      data: userDb
    })
  } catch (error) {
    res.status(400).json(error)
  }

  
})

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

router.post('/login', async (req, res) => {
  const { error } = schemaLogin.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const user = await User.findOne({email: req.body.email});

  if (!user) return res.status(400).json('User is not exist')

  const validatePassword = await bcrypt.compare(req.body.password, user.password);

  if(!validatePassword) return res.status(400).json('Invalid password');

  const token = jwt.sign({
    name: user.name,
    id: user._id
  }, process.env.TOKEN_SECRET || 'testotoken');

  res.header('auth-token', token).json({
    error: null,
    data: {
      name: user.name,
      token}
  })

})

module.exports = router;