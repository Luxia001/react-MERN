const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeID = req.params.pid;
  try {
    const place = await Place.findById(placeID).exec();
    if (!place) {
      return next(
        new HttpError("Could not find place for the provided ID.", 404)
      );
    }

    res.json({ place: place.toObject({ getters: true }) });
  } catch (err) {
    const error = new Error(err, 500);
    return next(error);
  }
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");

    res.json({
      places: userWithPlaces.places.map((place) =>
        place.toObject({ getters: true })
      ),
    });
  } catch (err) {
    const error = new Error(err, 500);
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("not find user or place", 404));
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("check data", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    image: req.file.path,
    location: coordinates,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("create failed", 500));
  }

  if (!user) {
    return next(new HttpError("cant find id", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("check data", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
    if (place.creator.toString() !== req.userData.userId) {
      return next(new HttpError("not allowed", 401));
    }
    place.title = title;
    place.description = description;
    await place.save();
    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    const errors = new HttpError(error, 500);
    return next(errors);
  }
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  if (!place) {
    return next(new HttpError("cant find place id", 404));
  }
  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("not allowed", 401));
  }
  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ _id: placeId }, { session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    fs.unlink(imagePath, (err) => {
      console.log(err);
    });
    res.status(200).json({ message: "Deleted place successfully" });
  } catch (error) {
    return next(new HttpError("something wrong delete", 500));
  }
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
