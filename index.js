const express=require('express');
const cookieParser = require('cookie-parser');
const app=express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db= require('./config/mongoose');

//Middlewares
app.use(express.urlencoded());

app.use(cookieParser());

//accessing static files
app.use(express.static('assests'));

app.use(expressLayouts);

//extract style and scripts from sub pages into layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//use express router
app.use('/',require('./routes'));

app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
})