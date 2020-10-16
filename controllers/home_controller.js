const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const Friendship = require('../models/friendship');

//using async await
module.exports.home = async function(req,res){
    console.log('Home Controller!!!');
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

        // console.log('################### all posts ',posts);
    
        let users = await User.find({});
        let friends = [];

        if(req.isAuthenticated())
        {
            friends = await Friendship.find({$or: [
                {
                    from_user : req.user.id,
                    status : true
                    
                },{
                    to_user : req.user.id,
                    status : true
                }
            ]}).populate('from_user').populate('to_user');
        }

        console.log('**********friends : ',friends);

        req.flash('success' , 'Home Page');
        return res.render('home',{
            title : "Codeial | Home",
            posts : posts,
            all_users : users,
            all_friends : friends
        });
        
    }catch(err){
        console.log('Error',err);
    }

    
}



//format = module.exports.address_name = function(req,res){}


/*using then
Post.find({}).populate('comments').then(function());
let posts = Post.find.populate('comments').exec();
post.then();   // Then represents the execution of the query written before it (Refer Promises)
*/