const mongoose = require("mongoose");

const {Schema} = mongoose;

const expScheme = new Schema({
  text: String,
  dateNow: String,
  price: Number
});

module.exports = Exspenses = mongoose.model("exps", expScheme);