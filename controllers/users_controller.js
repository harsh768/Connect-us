const User = require('../models/user');

//for deleting avatar
const fs = require('fs');
const path = require('path'); 

//Keep it same no need to add async await
module.exports.profile = function(req,res)
{
    User.findById(req.params.id,function(err,user){
        
        req.flash('success' , 'User Profile Page');
        return res.render('user_profile',{
            title : "Codeial | Profile",
            profile_user : user
        });
    })
}

module.exports.update = async function(req,res)
{
    // if(req.params.id == req.user.id)
    // {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user)
    //     {
    
    //         req.flash('success','User details successfully updated');
    //         return res.redirect('back');
    //     })
    // } else{
    //     return res.status(401).send('unauthorised');
    // }

    if(req.user.id == req.params.id)
    {
        try{

            let user = await User.findById(req.params.id);

            //as the form is a multi type so our body parser is not able to parse it therefore multer comes in play here
            User.uploadedAvatar(req,res,function(err)
            {
                if(err)
                {   console.log('*****Multer error',err); return; }

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file)
                {
                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    //this is saving the path of upload file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            })

        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }

    }else{

    }

}

//rendering the singup page
module.exports.signup = function(req,res){     

    if(req.isAuthenticated())
    {
        req.flash('success','User already there');
        return res.redirect(`/users/profile/${req.user.id}`);
    }

    req.flash('success','Enter the details of the user');
    return res.render('user_sign_up',{
        title : "Codeial | Sign-Up"
    });
}

//rendering the signin page
module.exports.signin = function(req,res){   
    
    if(req.isAuthenticated())
    {
        console.log(req.flash , req.user) ;
        return res.redirect(`/users/profile/${req.user.id}`);
    }

    return res.render('user_sign_in',{
        title : "Codeial | Sign-In"
    });
}


// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                req.flash('success','New User created');
                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


//Signin and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully');    //This is currently in req to pass in res create own middleware
    return res.redirect('/');
}

//Signing out
module.exports.destroySession = function(req,res)
{
    req.logout();
    req.flash('success','You have logged out!');

    return res.redirect('/');
}