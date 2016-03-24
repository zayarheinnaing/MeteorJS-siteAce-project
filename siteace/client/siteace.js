// router config

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/',function(){
    this.render('navbar',{
        to: 'navbar'
    });
    this.render('website_form', {
        to: 'form'
    });
    
    this.render('website_list',{
        to: 'main'
    });
});

Router.route('/website_item/:_id', function(){
    this.render('navbar',{
        to: 'navbar'
    });
    this.render('website_detail',{
        to: 'main',
        data: function(){
            return Websites.findOne({_id:this.params._id});
        }
    });
});


/////
// template helpers
/////
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});


// helper function that returns all available websites
Template.website_list.helpers({
    websites: function () {
        return Websites.find({}, {sort: {upvote: -1, downvote: 1, createOn: -1}});
    }
});

Template.website_detail.helpers({
    getUser:function(user_id){
        var user = Meteor.users.findOne({_id:user_id});
        if (user){
            return user.username;
        }
        else {
            return "Anonymous";
        }
    },
    comments:function(){
        return Comments.find({website_id:this._id}, {sort: {createOn:1}});
    }
})


/////
// template events
/////

Template.website_item.events({
    "click .js-upvote": function (event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id " + website_id);
        Websites.update({_id: website_id}, {$inc: {upvote: 1}});
        // put the code in here to add a vote to a website!

        return false;// prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id " + website_id);
        Websites.update({_id: website_id}, {$inc: {downvote: 1}});

        // put the code in here to remove a vote from a website!

        return false;// prevent the button from reloading the page
    }
});

Template.website_form.events({
    "click .js-toggle-website-form": function (event) {
        $("#website_form").toggle('slow');
    },
    "submit .js-save-website-form": function (event) {

        // here is an example of how to get the url out of the form:
        var url = event.target.url.value;
        var title = event.target.title.value;
        var description = event.target.description.value;
        console.log("The url they entered is: " + url);
        console.log("The title they entered is :" + title);
        console.log("The description they entered is :" + description);
        Websites.insert({
            title: title,
            url: url,
            description: description,
            addBy: Meteor.user()._id,
            createOn: new Date(),
            upvote: 0,
            downvote: 0
        });
        //  put your website saving code in here!
        HTTP.call("GET", url,{headers:{"Allow-Control-Allow-Origin":"*"}},function (error, result) {
            if(error)
            {
                console.log(error);
            }
            else{
                console.log("result: "+result);
            }
        });
        $("#website_form").toggle('slow');
        return false;// stop the form submit from reloading the page

    }
});

Template.website_detail.events({
    "click .js-upvote": function (event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id " + website_id);
        Websites.update({_id: website_id}, {$inc: {upvote: 1}});
        // put the code in here to add a vote to a website!

        return false;// prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id " + website_id);
        Websites.update({_id: website_id}, {$inc: {downvote: 1}});

        // put the code in here to remove a vote from a website!

        return false;// prevent the button from reloading the page
    },
    "click .js-back":function (event) {
        history.back();
    },
    "submit .js-comment-form":function (event) {
        var comment = event.target.comment.value;
        //alert(comment);
        Comments.insert({
            website_id:this._id,
            comment:comment,
            createOn: new Date()
        });
        event.target.comment.value = '';
        return false;
    }
})
