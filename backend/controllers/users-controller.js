const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
    res.json({ users: users.map((u) => u.toObject({ getters: true })) });
  } catch (error) {
    return next(new HttpError(error, 500));
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("check data", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const err = new HttpError("User exits aleady", 422);
      return next(err);
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      return next(new HttpError("not create user", 500));
    }

    const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      places: [],
    });
    await createdUser.save();

    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );
    } catch (error) {
      return next(new HttpError("signing failed", 500));
    }

    res
      .status(201)
      .json({ user: createdUser.id, email: createdUser.email, token: token });
  } catch (error) {
    const err = new HttpError("failed", 500);
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const err = new HttpError("Invalid", 403);
      return next(err);
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (bcryptError) {
      const err = new HttpError("Could not validate password", 500);
      return next(err);
    }
    if (!isValidPassword) {
      const err = new HttpError("Invalid password", 403);
      return next(err);
    }
    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );
    } catch (error) {
      return next(new HttpError("logging in failed", 500));
    }
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  } catch (error) {
    return next(new HttpError(error, 500));
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
