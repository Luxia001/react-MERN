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
    const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password,
      places: [],
    });
    await createdUser.save();
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

    if (!existingUser || existingUser.password !== password) {
      const err = new HttpError("Invalid", 422);
      return next(err);
    }
    const createdUser = new User({
      email,
      password,
    });
    res.json({
      message: "Logged in",
      user: existingUser.toObject({ getters: true }),
    });
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
