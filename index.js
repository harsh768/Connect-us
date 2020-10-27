const express=require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app=express();
require('./config/view-helpers')(app);


const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db= require('./config/mongoose');
const redis=require("redis")

//used for session cookie
const session = require('express-session');

//Passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportjwt = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo')(session);
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

//Using SASS
const sassMiddleware = require('node-sass-middleware');

//Using flash for flash messages
const flash=require('connect-flash');
const customMware = require('./config/middleware');

if(env.name == "development")
{
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}



//Middlewares
app.use(express.urlencoded({extended : false}));

app.use(cookieParser());

//accessing static files
app.use(express.static(env.asset_path));

//make the uploads path available to the browser 
app.use('/uploads',express.static(__dirname + '/uploads'));

//Setting up morgan
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

//extract style and scripts from sub pages into layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//Views
app.set('view engine','ejs');
app.set('views','./views');

//Mongo store is used to store the seesion cookie in the database
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store : new MongoStore(
        {
            mongooseConnection : db,
            autoRemove : 'disabled'
        },
        function(err)
        {
            console.log(err || 'connect=mongo setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
})

