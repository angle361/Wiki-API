const express = require ("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);  //here we made our collection named articles

app.get("/articles",function(req,res){
  Article.find(function(err,foundArticles){
    res.send(foundArticles);
  })
})

app.post("/articles",function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
      title : req.body.title,
      content : req.body.content
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
     res.send("successfully deleted");
   }
  });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});