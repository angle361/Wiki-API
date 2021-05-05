const express = require ("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting db
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});

//making schema
const articleSchema = {
  title: String,
  content: String
};

//making collection
const Article = mongoose.model("Article",articleSchema);  //here we made our collection named articles


//////////////////////////////////////////Requesting all the articles/////////////////////////////////////////


// app.route("/articles").get().post().delete();
app.get("/articles",function(req,res){
  Article.find(function(err,foundArticles){
    res.send(foundArticles);                          ////when we want the existing document
  })
})

app.post("/articles",function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
      title : req.body.title,
      content : req.body.content                 ///when we want to add document
    });

    newArticle.save(function(err){
      if(!err){
        res.send("success");
      }
      else{
        res.send(err);
      }
    });
})

app.delete("/articles",function(req,res){
  Article.deleteMany(function(err){
   if(!err){
     res.send("successfully deleted");              ///when we want to delete document
   } 
  });
})



/////////////////////////////////////////Requesting a single articles/////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }
      else{
        res.send("no such article is found");
      }
    })
})

.put(function(req,res){
  Article.update(
    {title : req.params.articleTitle},
    {title: req.body.title,content : req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("successfully updated");
      }
      else{
        res.send(err);
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title : req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
   Article.deleteOne({title : req.params.articleTitle},function(err){
    if(!err){
      res.send("successfully deleted");
    }
    else{
      res.send(err);
    }
   });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});