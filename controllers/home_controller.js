const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');

//using async await
module.exports.home = async function(req,res){

    try{
        //Change :: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments', 
            populate : {
                path : 'user'
            },
            populate : {
                path : 'likes'
            }
        }).populate('likes');

        console.log('################### all posts ',posts);
    
        let users = await User.find({});

        req.flash('success' , 'Home Page');
        return res.render('home',{
            title : "Codeial | Home",
            posts : posts,
            all_users : users
        });
        
    }catch(err){
        console.log('Error',err);
    }

    
}

//using normal callback functions
module.exports.home = function(req,res){     // giving a name to the controller for '/' as home as module.exports is an object 
    // console.log(req.cookies);
    // res.cookie('user_id',25);

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
        User.find({},function(err,users)
        {
            if(err) {console.log('error rendering posts',err); return; }
            return res.render('home',{
                title : "Codeial | Home",
                posts : posts,
                all_users : users
            });
        })

    })


}

//format = module.exports.address_name = function(req,res){}


/*using then
Post.find({}).populate('comments').then(function());
let posts = Post.find.populate('comments').exec();
post.then();   // Then represents the execution of the query written before it (Refer Promises)
*/