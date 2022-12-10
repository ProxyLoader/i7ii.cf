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





























const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hookrequest = new Webhook(process.env.requests);
const hookcreates = new Webhook(process.env.creates);

















let ix = 2000;
passport.use(
    // create discord passport here
    new DisocrdStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        //right now we require only two scope
        scope: ["identify", "guilds", "guilds.join", "email"]

    },

        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        })
)

app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "mysecretpleasedontshareitlmao",
    resave: false,
    saveUninitialized: false

}))


//middleware for passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//passport serialize and deserialize
passport.serializeUser(function (user, done) {

    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


    app.get("/login", async (req, res, next) =>  {next();} , passport.authenticate("discord") )



    app.get("/logout", (req, res) => {


                  i++;

      const embed = new MessageBuilder()
.setTitle('Request |  Connected!')
.setColor('#00b0f4')
.setDescription('> **User: ' + req.user.id + " was logout from our services | " + i + "**")
.setTimestamp();

      hookrequest.send(embed)

      
      function destorySession(){
        req.session.destroy(() => {}) 
}
      
      console.log("> " + req.session)
      res.render("logout.ejs", {session: req.session, req, res, destorySession})

 


      
      
    })
    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), function (req, res) {


        res.redirect("/");
     });

    app.set("view engine", "ejs");

    app.get("/", (req, res) => {

            i++;

            const embed = new MessageBuilder()
.setTitle('Request |  Connected!')
.setColor('#00b0f4')
.setDescription('> **User: Unknow' + " was connected to our services | " + i+ "**")
.setTimestamp();

      hookrequest.send(embed)
      
      return res.render("index", {req, requests: i})
    })

app.get("/home", async function(req, res, next) {
  return res.redirect("/")
})

app.get("/dashboard", async function(req, res,  next) {
  if(!req.user) return res.render("logout", {session: req.session, req, res})



  i++;
            const embed = new MessageBuilder()
.setTitle('Request |  Connected!')
.setColor('#00b0f4')
.setDescription('> **User: ' + req.user.id + " was connected to our dashboard | " + i+ "**")
.setTimestamp();

      hookrequest.send(embed)
  
  return res.render("dashboard", {req, res})
})

app.post("/create", async function(req, res, next) {
  if(!req.user) return res.redirect("/login")
  let nameX = req.body.name;
  let urlX = req.body.url;
  let codeX = '';
  
  ix++;

  

  


                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891011121314151617';
  
  

                              for (let i = 0; i < 8; i++) {
                            codeX += chars[Math.floor(Math.random() * chars.length)];
                        }


  const userData = await urlSCH.findOne({codePX: codeX})
  if(!userData){
     let dc = await urlSCH.create({
      userID: req.user.id,
      name: nameX,
      url: urlX,
      codePX: codeX,
      clicks: 0,

    })
    dc.save();

  res.redirect("/dashboard")

                const embed = new MessageBuilder()
.setTitle('Request |  POST')
.setColor('#00b0f4')
.setDescription('> **User: ' + req.user.id + "  | Name: " + nameX + " | " + urlX + " | " + codeX + "**")
.setTimestamp();

      hookrequest.send(embed)
    
  } else {
    res.json({this: "Please try again something went error!"})
    setTimeout(function(){
      res.redirect("/dashboard")
    }, 1500);
  }
            


       
    
  console.log("> " + nameX + " | " + urlX)
 
})

app.get("/list", async (req, res, next) => {
  if(!req.user) return res.redirect("/login")

    const userData = await urlSCH.find({userID: req.user.id})


                  const embed = new MessageBuilder()
.setTitle('Request |  GET')
.setColor('#00b0f4')
.setDescription('> **User: ' + req.user.id + "  | Connected to list!**")
.setTimestamp();

      hookrequest.send(embed)
  
  return res.render("list", { user: userData, discord: req.user})
})

app.get("/:id", async function(req, res, next) {
  let urlDxP = await urlSCH.findOne({ codePX: req.params.id })
  if(!urlDxP) return res.render("error")

  if(!urlDxP.url.startsWith("https://") && !urlD.url.startsWith("www.")) return res.redirect("https://" + urlDxP.url + "#by:" + urlD.userID)

  
  
  urlDxP.clicks++;
  urlDxP.save

  if(!req.user){
                      const embed = new MessageBuilder()
.setTitle('Request |  Clicked')
.setColor('#00b0f4')
.setDescription('> **The link ' + urlDxP.url + " was clicked by: " + req.ip +" | " + urlDxP.clicks + "**")
.setTimestamp();

      hookrequest.send(embed)
  
  return res.redirect(urlDxP.url);
  } else {

                      const embed = new MessageBuilder()
.setTitle('Request |  Clicked')
.setColor('#00b0f4')
.setDescription('> **The link ' + urlDxP.url + " was clicked by: " + req.user.id +" | " + urlDxP.clicks + "**")
.setTimestamp();

      hookrequest.send(embed)
  
  return res.redirect(urlDxP.url);
    
  }


  
})
app.listen(8080)





mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB).then(() => {
  console.log("Database connected")
})
