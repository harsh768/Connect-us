// CHANGE :: create a class to toggle friends when a link is clicked, using AJAX
class ToggleFriend{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.ToggleFriend();
    }
// call 9354500760 ok
    ToggleFriend(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                if (data.data.removed == true){
                    $(self).html('Add Friend');
                    // $(self).attr('friend', "false");
                    
                }else{
                    $(self).html('Remove Friend');
                    // $(self).attr('friend', "True");
                }

            })
            .fail(function(errData) {
                console.log('error in completing the request',errDa);
            });
            

        });
    }
}
