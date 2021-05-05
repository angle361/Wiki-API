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
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});