const express = require("express")
const app = express();




const Cryptr = require("cryptr")
const cryptr = new Cryptr('myTotallySecretKey');
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const DisocrdStrategy = require("passport-discord").Strategy;
const passport = require("passport");

const mongoose = require("mongoose")
const urlSCH = require("./schema/url-schema")


const config = require("./config.json")
let registered = 0;
let i = 0;
require('https').globalAgent.options.rejectUnauthorized = false;

app.listen(3000)


passport.use(
  // create discord passport here
  new DisocrdStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL,
    //right now we require only two scope
    scope: ["identify", "guilds", "guilds.join", "email"]

  },

    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    })
)

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: "mysecretpleasedontshareitlmao",
  resave: false,
  saveUninitialized: false,

}))




//middleware for passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//passport serialize and deserialize
passport.serializeUser(function(user, done) {

  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



app.get("/login", async (req, res, next) => { next(); }, passport.authenticate("discord"))



app.get("/logout", (req, res) => {


  i++;




  function destorySession() {
    req.session.destroy(() => { })
  }

  console.log("> " + req.session)
  res.render("logout.ejs", { session: req.session, req, res, destorySession })






})
app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), function(req, res) {


  res.redirect("/");
});

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

  const userData = await urlSCH.find()
  i++;
  
  return res.render("index", { req, requests: i, user: userData, requests: i })
})

app.get("/home", async function(req, res, next) {
  return res.redirect("/")
})

app.get("/dashboard", async function(req, res, next) {
  if (!req.user) return res.render("logout", { session: req.session, req, res })



  i++;


  return res.render("dashboard", { req, res })
})

app.post("/create", async function(req, res, next) {
  if (!req.user) return res.redirect("/login")
  let nameX = req.body.name;
  let urlX = req.body.url;
  let codeX = '';

  if (!nameX) return res.json({ error: "Missing name!" })
  if (!urlX) return res.json({ error: "Missing url!" })

  ix++;

  if(!req.user) return res.redirect("/login")




  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891011121314151617';



  for (let i = 0; i < 8; i++) {
    codeX += chars[Math.floor(Math.random() * chars.length)];
  }


  const userData = await urlSCH.findOne({ codePX: codeX })
  if (!userData) {
    let dc = await urlSCH.create({
      userID: req.user.id,
      name: nameX,
      url: urlX,
      codePX: codeX,
      clicks: 0,

    })
    dc.save();

    res.redirect("/dashboard")


  } else {
    res.json({ this: "Please try again something went error!" })
    setTimeout(function() {
      res.redirect("/dashboard")
    }, 1500);
  }





  console.log("> " + nameX + " | " + urlX)

})


app.post("/deleteid", async (req, res, next) => {
  if(!req.user) return res.render("logout", {req: req})
        let appid = req.body.appid;
  const userData = await urlSCH.findOne({ codePX: appid })
  if(!userData) return res.json({error: "Cannot find any ids in your account!"})

  if(userData.userID !== req.user.id) return res.json({error: "This id is not registered in your account!"})
      await urlSCH.deleteOne({
      codePX: appid,
      name: userData.name,
    })


  console.log("Appid: " + appid)

  return res.redirect("/delete")
    
})

app.get("/delete", async (req, res, next) => {
  if(!req.user) return res.render("logout", {req: req, user: req.user})
    return res.render("delete", {req: req})
})

app.get("/list", async (req, res, next) => {
  if (!req.user) return res.redirect("/login")

  const userData = await urlSCH.find({ userID: req.user.id })


  return res.render("list", { user: userData, discord: req.user })
})

app.get("/:id", async function(req, res, next) {
  let urlDxP = await urlSCH.findOne({ codePX: req.params.id })
  if (!urlDxP) return res.render("error")

  if (!urlDxP.url.includes("https://") && !urlDxP.url.includes("www.")) return res.redirect("https://" + urlDxP.url)




    return res.redirect(urlDxP.url);




})


   process.on('error', function(e) {
     return console.log("Error: " + e)
   });

      //API Errors

process.on('unhandledRejection', error => {
  console.log('Unhandled promise rejection: ' + error);


});

process.on("rejectionHandled", error => {
  console.error("There is an uncaughtExceptionMonitor error: ", error)

})

process.on("uncaughtException", error => {
  console.error("There is an uncaughtExceptionMonitor error: ", error)

})


process.on("uncaughtExceptionMonitor", error => {
  console.error("There is an uncaughtExceptionMonitor error: ", error)
})


mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB).then(() => {
  console.log("Database connected")
})
