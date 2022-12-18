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

var errorHandler = require('errorhandler');



const config = require("./config.json")
let registered = 0;
let i = 0;
require('https').globalAgent.options.rejectUnauthorized = true;


let ix = 0;
    errorHandler.title = "Something error";


app.set("view engine", "ejs");

passport.use(
  // create discord passport here
  new DisocrdStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL,
    //right now we require only two scope
    scope: ["identify"]

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
    app.use(errorHandler());


//passport serialize and deserialize
passport.serializeUser(function(user, done) {

  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});




//app.get("/login", async (req, res, next) => { next(); }, passport.authenticate("discord"))




app.get("/logout", (req, res) => {
  //try{
  //i++;
  //function destorySession() {
   // req.session.destroy(() => { })
 // }

  //console.log("> " + req.session)
  //res.render("logout.ejs", { session: req.session, req, res, destorySession })





 // } catch(error){
   //          return res.json({error: "Something error handling your request"})

  //}

  return res.redirect("/#stoped!")

})
//app.get("/callback", passport.authenticate("discord", { failureRedirect: "/login" }), function(req, res) {

  app.get("/callback", async (req, res, next) => {
    return res.redirect("/")
  })




app.get("/", async (req, res) => {

  try{
    
  

  const userData = await urlSCH.find()
  i++;
  
  return res.render("index", { req, requests: i, user: userData, requests: i })

  } catch(error){
             return res.json({error: "Something error handling your request"})

  }
})


app.get("/home", async function(req, res, next) {
  return res.redirect("/")
})

app.get("/dashboard", async function(req, res, next) {

  try{
    
  
  if (!req.user) return res.render("logout", { session: req.session, req, res })



  i++;


  return res.render("dashboard", { req, res })

  } catch(error){
             return res.json({error: "Something error handling your request"})
  }
})

app.post("/create", async function(req, res, next) {

  try{
    
  
  if (!req.user) return res.redirect("/login")
  let nameX = req.body.name;
  let urlX = req.body.url;
  let codeX = '';

  if (!nameX) return res.json({ error: "Missing name!" })
  if (!urlX) return res.json({ error: "Missing url!" })

  ix++;

  if(!req.user) return res.redirect("/login")




  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891011121314151617';



  for (let i = 0; i < 5; i++) {
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

      for (let i = 0; i < 5; i++) {
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

    
    setTimeout(function() {
      res.redirect("/dashboard")
    }, 1500);
  }





  console.log("> " + nameX + " | " + urlX)

  }
    
  } catch(error){
             return res.json({error: "Something error handling your request"})

  }
})


app.post("/deleteid", async (req, res, next) => {

  try{
    
  
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

      } catch (error){
         return res.json({error: "Something error handling your request"})
    
      }

})

app.get("/delete", async (req, res, next) => {
  if(!req.user) return res.render("logout", {req: req, user: req.user})
    return res.render("delete", {req: req})
})

app.get("/list", async (req, res, next) => {

    try {
  if (!req.user) return res.redirect("/login")

  const userData = await urlSCH.find({ userID: req.user.id })


  return res.render("list", { user: userData, discord: req.user })
    

    } catch (error) {
     return res.json({error: "Something error handling your request"})
  }

  

})

app.get("/api/v3/", async (req, res, next) => {
  return res.json({functions: "> /create"})
})
app.get("/api/v3/create", async (req, res, next) => {
  const {key, url} = req.query;

    let codeX = '';
  

  if(!key) return res.json({respone: "Error invalid license key!"})
  if(key !== process.env.KEY) return res.json({respone: "The key not match the credintals!"})
  if(!url) return res.json({respone: "Please specify url!"})

  if(!url.startsWith("https://") && !url.startsWith("www.") && !url.endsWith(".")) return res.json({respone: "HTTP/s WWW./ missing"})

  
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891011121314151617';



  for (let i = 0; i < 5; i++) {
    codeX += chars[Math.floor(Math.random() * chars.length)];
  }


  const userData = await urlSCH.findOne({ codePX: codeX })

  if (!userData) {

    
    let dc = await urlSCH.create({
      userID: "1001096501814100050",
      name: codeX,
      url: url,
      codePX: codeX,
      clicks: 0,

    })
    dc.save();
    
  
  return res.json({status: "SUCCESS", code: codeX, url: url, fullurl: "https://i7ii.cf/" + codeX})

  } else {
    
      return res.json({status: "ERROR"})
  }
  
  
})

app.get("/:id", async function(req, res, next) {
  let urlDxP = await urlSCH.findOne({ codePX: req.params.id })
  if (!urlDxP) return res.render("error")

  if (!urlDxP.url.includes("https://") && !urlDxP.url.includes("www.")) return res.redirect("https://" + urlDxP.url)


  console.log("Someone clicked! the image or the link")
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





app.listen(80, async () => {
  console.log("The port is now opened to recive http traffic!")
})
