var keywords = ["sunflowers", "love", "dogs", "cookies"];
const express = require("express");
const app = express();
const bodyparser = require('body-parser');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
var $ = require("jquery")(window);
const request = require('request');
global.document = document;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("img"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.get("/", async function(req, res){
     let randomKeyword = Math.floor(Math.random() * 4);

     let or = req.query.orientation;

     let parsedData = await searchImage(keywords[randomKeyword], or);


     res.render("index", {"images":parsedData});

});

app.get("/results", async function(req, res){

    let keyword = req.query.keyword; 
    let or = req.query.orientation;

    let parsedData = await searchImage(keyword, or);

    res.render("results", {"images":parsedData});
   
});


function searchImage(keyword, orientation){

    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=15448688-20de9241e191f9396c50497fa&q='
          + keyword + "&orientation=" + orientation,
                 function (error, response, body) {

            if (!error && response.statusCode == 200  ) { 

                 let parsedData = JSON.parse(body); 

                 resolve(parsedData);

            
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }

          });

    });

}

app.get("*", function(req,res){
    res.send("Page Not Found");
    res.render("error");
});


app.listen(process.env.PORT,function(){
    console.log("Server up and running");
});