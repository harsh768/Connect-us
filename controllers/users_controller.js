const User = require('../models/user');

module.exports.profile = function(req,res)
{
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title : "Codeial | Profile",
            profile_user : user
        });
    })
}

module.exports.update = function(req,res)
{
    if(req.params.id == req.user.id)
    {
        User.findByIdAndUpdate(req.params.id, req.body, function(err,user)
        {
            return res.redirect('back');
        })
    } else{
        return res.status(401).send('unauthorised');
    }
}

//rendering the singup page
module.exports.signup = function(req,res){     

    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title : "Codeial | Sign-Up"
    });
}

//rendering the signin page
module.exports.signin = function(req,res){   
    
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
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

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


//Signin and create a session for the user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

//Signing out
module.exports.destroySession = function(req,res)
{
    req.logout();

    return res.redirect('/');
}