//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to the database
mongoose.connect("mongodb://localhost:27017/Wikidb", {useNewUrlParser:true, useUnifiedTopology: true });


//create schema 
const articleSchema = {
    title:String,
    content:String
    
};

//create document

const Article=mongoose.model("Article",articleSchema);

//////////////////Request Targeting All Articles////////////////////


//app.route method(combines all the requests into one single unit{A Chain Method})

//get request

app.route("/articles").get(function(req,res){
    
   Article.find(function(err,foundArticles){
       if(!err){
         res.send(foundArticles);
       }else{
         res.send(err);   
       }
   }) 
    
})
    //post request
    .post(function(req,res){

    //inserting data into collection
    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });
    
    newArticle.save(function(err){
        if(!err){res.send("Successfully Added The new Item ");}
        else{res.send(err);}
    });
})
    //delete request
    .delete(function(req,res){
    Article.deleteMany(function(err){
       if(!err){
           res.send("Successfully Deleted The Articles");
       }else{
           res.send(err);
       }
        
    });
    
});


//////////////////////Request Targeting Specific Articles///////////////


app.route("/articles/:articleTitle")
    
.get(function(req,res){
   Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
       if(foundArticle){
         res.send(foundArticle);
       }else{
         res.send("No Articles Matching the title was found");   
       }
   });
    
})
.put(function(req,res){
    Article.update({
        title:req.params.articleTitle
    },{title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
        if(!err){
            res.send("Successfully udpated The Article");
        }
    });
    
})
.patch(function(req,res){
       Article.update(
       {
        title:req.params.articleTitle},{$set:req.body}
       ,function(err){
        if(!err){
            res.send("Successfully udpated The Article");
        }else{
            res.send(err);
        }
    });

})

.delete(function(req,res){
    Article.deleteOne(
    {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the article");
            }
            else{
                res.send(err);
            }
        }
    );
});















app.listen(3000, function() {
  console.log("Server started on port 3000");
});