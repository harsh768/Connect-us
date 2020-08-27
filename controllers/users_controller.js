const User = require('../models/user');

module.exports.profile = function(req,res)
{
    return res.end('<h1>User profile</h1>');
}

//rendering the singup page
module.exports.signup = function(req,res){     
    return res.render('user_sign_up',{
        title : "Welcome to signup page of Codeial"
    });
}

//rendering the signin page
module.exports.signin = function(req,res){     
    return res.render('user_sign_in',{
        title : "Welcome to signin page of Codeial"
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
    //TODO Later
}