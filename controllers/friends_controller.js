const User = require('../models/user'); 
const Friendship = require('../models/friendship');

module.exports.togglefriend = async function(req,res)
{
    try {
        let removed = false;
        let sender = await User.findById(req.query.sender);
        let receiver = await User.findById(req.query.receiver);
        console.log('query : ',req.query);
        let isfriend = await Friendship.find({$or: [
            {
                from_user : sender,
                to_user : receiver,
                status : true
                
            },{
                from_user : receiver,
                to_user : sender,
                status : true
            }
        ]});
        console.log('isfriend : ' ,isfriend);
        if(isfriend.length )
        {
            await Friendship.findByIdAndDelete(isfriend._id);
            removed = true;
        }

        else
        {
            console.log(`sender : ${sender} , receiver: ${receiver}`);
            let newfriendship = await Friendship.create({
                from_user : sender,
                to_user : receiver,
                status : false
            });

            // Ques : Do we have to push in friendship model also ? 

        }

        return res.json(200, {
            message: "Request successful!",
            data: {
                removed : removed
            }
        })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

module.exports.acceptrequest = async function(req,res)
{
    let request = await Friendship.findById(req.params.id);

    request.status = true;

    await request.save();

    return res.redirect('back');
}

module.exports.declinerequest = async function(req,res)
{
    await Friendship.findByIdAndDelete(req.params.id);

    return res.redirect('back');
}