const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "";

async function getCoordsForAddress(address) {
  return {
    lat: 0,
    lng: 0,
  };

  const response = await axios.get(``);
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("not find api place", 422);
    throw error;
  }

  const coordinates = data.result[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
