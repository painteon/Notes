//////////////////////Boiler plate code/////////////////////
const express = require('express'); //require express
const ejs = require('ejs'); //require ejs
const bodyParser = require('body-parser'); //require body parser


///////////////////////////Mongoose//////////////////////////
const mongoose = require('mongoose'); //require mongoose


mongoose.set('useNewUrlParser', true); //both of these get rid of deprecation warnings
mongoose.set('useUnifiedTopology', true); //must be set before mongoose.connect()
// mongoose.set('debug', true);
mongoose.connect("mongodb+srv://admin-bobby:phenix360@cluster0.1ccp7.mongodb.net/diaryDB");

const app = express();

//////////////////////Ejs init/////////////////////////////

app.set('view engine', 'ejs'); //sets app.js to pass information over to ejs files

app.use(bodyParser.urlencoded({
  extended: true
})); //allows body parser to see into nested elements

app.use(express.static("public")); //allows app.js to find the css files in the public folder

const pageSchema = new mongoose.Schema({
  id: Number,
  title: String,
  text: String
});

const Page = mongoose.model("Page", pageSchema);

const initialPage = new Page({
  id: 1,
  title: "Put Title Here",
  text: "Write your day here. \nTo update a previous page, the title must be the same. \nTo delete a page, go to the page Saved Page window."
});

/////////////////////Get and Post/////////////////////////

app.get("/", function(req, res) {

  Page.find({}, async function(err, foundPage) {
    if (foundPage.length === 0) {
      await initialPage.save();
      console.log("default Item succesfully loaded")
      res.redirect("/");
    } else {
      res.render("diary", {
        allPages: foundPage
      }); //Get's information from the root page and renders a response
    }
  });
});

app.get("/history", function(req, res) {
  Page.find({}, function(err, foundPage){
    if (err){
      console.log(err);
    }else{
      res.render("history", {allPages: foundPage});
    }
  });
});

app.get("/delete", function(req, res){
  res.render("history");
});

app.get("/goHome", function(req, res){
});

app.post("/goHome", function(req, res){
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const info_1 = req.body.deleteButton;
  console.log(info_1);

  Page.deleteOne({id: info_1}, function(err){
    if (err){
      console.log(err);
    }
  });
  res.redirect("/history");
});

app.post("/history", function(req, res) {
  res.redirect("/history");
});


app.post("/", function(req, res) {
  const lTitle = req.body.leftInput; //attaching the input values to a variable for clarity
  const lText = req.body.leftText;



  if (lTitle !== "" || null) {
    const pageCount = 1;

    Page.find({}, function(err, pageList) {
      let executed = false;

        pageList.forEach(function(page){
          if(lTitle === page.title){
            executed = true;
            console.log("Updated old doc")
            Page.updateOne({title: lTitle}, {text: lText}, function(err) {
            if (err) {
                console.log(err);
              } else {
                console.log("success");
              }
            });
          }
          });

          if (!executed){
            const page_1 = new Page({ //an object similar to the page schema to capture the input values
              id: (pageList.length + pageCount),
              title: lTitle,
              text: lText
            });
            console.log("saved new doc")
            page_1.save();
          }
        res.redirect("/");
  });
}

});

/////////////////////Server///////////////////////////////

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("server is running succesfully");
}); //Creates server at port 3000
