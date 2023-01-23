const { Schema, model } = require("mongoose");

const urlschema = new Schema({





  
  
  requestIP: {type: String, required: false},
  userID: { type: String, required: false},
  name: { type: String, required: false},
  url: { type: String, required: false },
  codePX: { type: String, required: false },
  clicks: {type: Number, default: 0, required: false},
  createdMilli: {type: String, required: false},
  createdAt: {type: String, required: false},
  token: {type: String, required: false},
  username: {type: String, required: false},
  password: {type: String, required: false},
  jwt: {type: String, required: false},

});

const urlSCH = model("URLList", urlschema);



module.exports = urlSCH;
