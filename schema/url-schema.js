const { Schema, model } = require("mongoose");

const urlschema = new Schema({


  userID: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  codePX: { type: String, required: true },
  clicks: {type: Number, default: 0, required: true}

});

const urlSCH = model("URLList", urlschema);



module.exports = urlSCH;
