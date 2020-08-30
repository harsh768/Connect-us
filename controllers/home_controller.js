const Post = require('../models/post');

module.exports.home = function(req,res){     // giving a name to the controller for '/' as home as module.exports is an object 
    // console.log(req.cookies);
    // res.cookie('user_id',25);

    // Post.find({}, function(err,posts)
    // {
    //     return res.render('home',{
    //         title : "Codeial | home",
    //         posts : posts
    //     });
    // })

    //Populating the user of each post
    Post.find({})
    .populate('user')
    .populate({
        path : 'comments', 
        populate : {
            path : 'user'
        }
    })
    .exec(function(err,posts)
    {
        if(err) {console.log('error rendering posts',err); return; }
        return res.render('home',{
            title : "Codeial | home",
            posts : posts
        });
    })


}

//format = module.exports.address_name = function(req,res){}