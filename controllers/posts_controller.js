const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req,res)
{
    Post.create({
        content : req.body.content,
        //req . user beacuse there is schema named user so it will be there
        user : req.user._id,
    },function(err,post)
    {
        if(err){console.log('error creating a post');return ;}

        return res.redirect('back');
    });
}

module.exports.destroy = function(req,res)
{
    Post.findById(req.params.id, function(err,post)
    {
        //.id means converting the object id into string (extension of mongoose) for comparing it should be string
        if(post.user == req.user.id)
        {
            post.remove();
            
            Comment.deleteMany({post : req.params.id}, function(err)
            {
                return res.redirect('back');
            })
        }
        else
        {
            return res.redirect('back');
        }

    })
}