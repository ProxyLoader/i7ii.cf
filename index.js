
const pm2 = require('pm2');


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
const axios = require("axios")
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
const crypto = require("crypto")

const config = require("./config.json")
let registered = 0;
let i = 0;


let ix = 0;
    errorHandler.title = "Something error";


app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: "mysecretpleasedontshareitlmao",
  resave: false,
  saveUninitialized: false,

}))



app.use(function(err, req, res, next) {
    console.log(err)
  res.status(200).render('error')
});


let limitRDF = 500


function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 9; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}



const createToken = (username, password) => {


  let randomChunk = Math.floor(Math.random() * 100000000) + 100
  
    const usernameHash = crypto.createHash("sha256").update(username + generateRandomString() ).digest("base64");
    const passwordHash = crypto.createHash("sha256").update(password + randomChunk).digest("base64");
    const randomString = crypto.randomBytes(64).toString("base64");
    const token = `${usernameHash}.${passwordHash}.${randomString}`;
    return token;
};




app.get("/", async (req, res) => {

  try{
    
  

    const token = req.cookies.token
  i++;
    
    let userProfile = await urlSCH.findOne({token: token})
    if(!userProfile) console.log("No profile matched")
    
    console.log(userProfile)
  
return res.render("index", { req, requests: i, userProfile: userProfile, token: token })

  
  } catch(error){
             return res.json({error: "Something error handling your request"})

  }
})


app.get("/home", async function(req, res, next) {
  return res.redirect("/")
})

app.get("/dashboard", async function(req, res, next) {

  try{

    if(!req.cookies.token) return res.redirect("/register")

    let userData = await urlSCH.findOne({token: req.cookies.token})
    if(!userData) return res.redirect("/login")
    if(userData.token !== req.cookies.token) return res.json({content: "Invalid access token! (Forbidden Authorization)"})


  i++;


  return res.render("dashboard", { req, res, userData })

  } catch(error){
             return res.json({error: "Something error handling your request"})
  }
})




app.get("/logout", async (req, res, next) => {
  const token = req.cookies.token
  let userData = await urlSCH.findOne({token: token})
  if(!userData) return res.send("You cannot access this page go <a href='/login'>login</a> before you do this action")
  
  return res.render("logout", {userData, res, req})
})

app.get("/login", async (req, res, next) => {
  const token = req.cookies.token;
  let jwt = req.query.jwt;

  // Find the user by token cookie or jwt query parameter
  let userData;
  if (token) {
    userData = await urlSCH.findOne({ token: token });
  } else if (jwt) {
    userData = await urlSCH.findOne({ jwt: jwt });
  }

  // If no user is found, render the login page
  if (!userData) {
    return res.render("login", { req, res });
  }

  // If a user is found, set the token cookie and redirect to the homepage
  res.cookie("token", userData.token);
  return res.redirect("/");
});



app.get("/register", async (req ,res ,next) => {

  return res.render("register", {req, res})
})



function generateJWT() {
  return crypto.randomBytes(45).toString('hex');
}




app.post("/register", async (req, res) => {
  const {username, password} = req.body;

  if(!username || !password) return res.send("Please fill the requirements");

  // Check if the username already exists in the database
  let existingUser = await urlSCH.findOne({username});
  if (existingUser) return res.json({status: "ERROR", content: "Username already taken, please choose a different one."});


  let jwtToken = generateJWT();
  // Create new user
  let dc = await urlSCH.create({
    username: username,
    password: password,
    token: createToken(username, password),
    jwt: jwtToken,
  });

  
  
  return res.redirect("/login?jwt=" + jwtToken)
});





app.post("/login", async (req,res, next) => {
  
  console.log(req.body)

  let userData = await urlSCH.findOne({username: req.body.username, password: req.body.password})
  if(!userData) return res.send("This user could not founded in our databases!")
  if(!userData.token) return res.send("Really weird no token founded in this account contact support!")
  
  res.cookie("token", userData.token)

  return res.redirect("/dashboard")
  
})



app.post("/create", async function(req, res, next) {

      if(req.cookies.rDfWP_DMC_LOP098) return res.json({status: "ERROR", content: "You reach the limit of requests try again after 3 seconds"})
  
      if(!req.cookies.token) return res.json({status: "ERROR", content: "Invalid access token! Relogin"})


  
    let userData = await urlSCH.findOne({token: req.cookies.token})
    if(!userData) return res.redirect("/login")
    if(userData.token !== req.cookies.token) return res.json({status: "ERROR" ,content: "Invalid access token! (Forbidden Authorization)"})  

  const {name, url} = req.body

  if(!name || !url) return res.json({status: "ERROR", content: "Invalid request missing name or url (requirements)"})

    if(!url.startsWith("https://") && !url.startsWith("www.") && !url.endsWith(".")) return res.json({status: "ERROR" , content: "HTTP/s WWW./ missing"})
    if(url.includes("xnx") || url.includes("porn") || url.includes("sex") || url.includes("gay") || url.includes("xnx") || url.includes("lgbtq")) return res.json({status: "ERROR", content: "Blocked cause contains nfsw"})


  
  
let codeX = '';
  
 const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891011121314151617';

  
  


  for (let i = 0; i < 5; i++) {
    codeX += chars[Math.floor(Math.random() * chars.length)];
  }
  
  
        let timeMilli = Math.floor(Date.now() / 1000)

  let dc = await urlSCH.create({
    requestIP: req.ip,
    name: name,
    url: url,
    codePX: codeX,
    createdMilli: timeMilli,
    createdAt: new Date().toUTCString(),
    username: userData.username,
    token: userData.token,
  })

  dc.save();
  

  res.cookie("rDfWP_DMC_LOP098", "wP9wXa269RQXplTqArPoXm97X=", {maxAge: limitRDF})

  return res.json({status: "SUCCESS", name: name, url: url, code: codeX, full: "https://i7ii.cf/" + codeX})
  
});

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
  const token = req.cookies.token
  if(!token) return res.redirect("/login")
  let userData = await urlSCH.findOne({token: token})
  if(!userData) return res.json({status: "ERROR", content: "This cookie is suspicous or invalid!"})

  const id = req.query.id
if(!id) return res.json({status: "ERROR", content: "Missing ID (Code) query!"})

  let idData = await urlSCH.findOne({codePX: id})
  if(!idData) return res.json({status: "ERROR", content: "This ID (Code) is invalid!"}) 
  if(idData.token !== userData.token) return res.json({status: "ERROR", content: "This ID (Code) is not yours!"})


  let deletedCode = await urlSCH.findOneAndDelete({codePX: id})
if(deletedCode) return res.json({status: "SUCCESS", content: "Code removed successfully"})


});
  
app.get("/list", async (req, res, next) => {

    try {

  if(!req.cookies.token) return res.redirect("/")
      
  const userData = await urlSCH.find({ token: req.cookies.token })
      if(!userData) return res.json({status: "ERROR", content: "This user is invalid! Try relogin"})

      console.log(userData)

  return res.render("list", { user: userData })
    

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

  if(!url.startsWith("https://") && !url.startsWith("www.") && !url.endsWith(".")) return res.json({status: "ERROR" , respone: "HTTP/s WWW./ missing"})

  
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891011121314151617';



  for (let i = 0; i < 5; i++) {
    codeX += chars[Math.floor(Math.random() * chars.length)];
  }

  if(url.includes("xnx") || url.includes("porn") || url.includes("sex") || url.includes("gay") || url.includes("xnx") || url.includes("lgbtq")) return res.json({status: "ERROR", content: "Blocked cause contains nfsw"})
  

  const userData = await urlSCH.findOne({ codePX: codeX })  

  
  if (!userData) {


      let timeMilli = Math.floor(Date.now() / 1000)
    
    let dc = await urlSCH.create({
      requestIP: req.ip,
      userID: "1001096501814100050",
      name: codeX,
      url: url,
      codePX: codeX,
      createdMilli: timeMilli,
      createdAt: new Date().toUTCString(),
      clicks: 0,

    })
    dc.save();
    
  
  return res.json({status: "SUCCESS", code: codeX, url: url, fullurl: "https://i7ii.cf/" + codeX})

  } else {
    
      return res.json({status: "ERROR", content: "Error generating code!"})
  }
  
  
})

app.get("/api/v3/info/:code", async (req, res, next) => {
  let urlDxP = await urlSCH.findOne({ codePX: req.params.code })
  if (!urlDxP) return res.json({status: "ERROR", content: "No data founded about this code!"})

  
  return res.json({status: "SUCCESS", userID: urlDxP.userID, clicks: urlDxP.clicks.toString(), full: urlDxP.url, createdMilli: urlDxP.createdMilli, createdAt: urlDxP.createdAt})
})


app.get("/:id", async function(req, res, next) {
  let urlDxP = await urlSCH.findOne({ codePX: req.params.id })
  if (!urlDxP) return res.render("error")
  

  let maliclousLinks = ["iplogger", "grabify"]
let isMalicious = maliclousLinks.some(link => urlDxP.url.includes(link))

if (isMalicious) {
    return res.render("warn", { urlDxP: urlDxP });
} else {
    urlDxP.clicks++
    urlDxP.save()
    return res.redirect(urlDxP.url);
}

  

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





app.listen(8000, async () => {
  console.log("The port is now opened to recive http traffic!")
})
