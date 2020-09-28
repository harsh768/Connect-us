const queue = require('../config/kue');

const CommentMailer = require('../mailers/comments_mailers');

queue.process('emails',function(job,done)
{
    console.log('***********Your emails worker is processing the work');

    CommentMailer.newComment(job.data);

    done();
})
