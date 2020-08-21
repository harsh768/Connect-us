module.exports.home = function(req,res){     // giving a name to the controller for '/' as home as module.exports is an object 
    return res.end('<h1>Express is up for codeial</h1>')
};

//format = module.exports.address_name = function(req,res){}