const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailers');

module.exports.create = async function(req,res)
{
    try{
        let post = await Post.findById(req.body.post);   // . post beacuse in form in ejs post id in comments is passed in input name post
    
        if(post)
        {
            let comment = await Comment.create
            ({
                content : req.body.content,
                post : req.body.post,
                user : req.user._id
            });

            post.comments.push(comment);
            post.save();  //save after updating

            // Similar for comments to fetch the user's id!
            comment = await comment.populate('user', 'name email').execPopulate();
            //write line 21 and 22 out for nodemailer to prepopulate user even if req is not xhr and also populate email 

            commentsMailer.newComment(comment);

            if (req.xhr){
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            //pushing comment to post schema comments array
            // post. comments. push(comment);
            // post. save();  //save after updating

            req.flash('success','You have commented on the post!');
            res.redirect('/');
        }
    }catch(err){
        console.log('Error creating a post',err);
    }
}

module.exports.destroy = async function(req, res)
{
    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;
            comment.remove();

            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success','Comment deleted!');
            return res.redirect('back');
            
        }else{
            return res.redirect('back');
        }
    } catch(err){
        console.log('Error deleting a comment',err);
    }
}
