module.exports.home = function(req,res){     // giving a name to the controller for '/' as home as module.exports is an object 
    
    console.log(req.cookies);
    res.cookie('user_id',25);

    return res.render('home',{
        title : "home"
    });
}



//format = module.exports.address_name = function(req,res){}