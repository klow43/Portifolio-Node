const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//download image to server
const download = function(url, filename, callback){
  request.head(url, function(err,res,body){
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/' + filename))).on('close', callback);
  });
};

router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', {cakes: JSON.parse(data)});
});

router.post('/',jsonParser, function(req, res, next){
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);  
  if(validationPOST(req,res,portfoliosArray) == true){
    if(portfoliosArray.filter(x => x.name === req.body.name).length == 0){
        download(req.body.url, req.body.name, function(){
          console.log("Image posted and saved : " + req.body.name)
        });
        const newArray = portfoliosArray.concat([req.body])
        fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
      }
  }
  res.end();
});

router.delete('/', jsonParser, function(req, res, next){
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if(validationDELETE(req,res,portfoliosArray) == true){
    let newArray = portfoliosArray.filter(x => x.name !== req.body.name)
    fs.unlink(path.resolve(__dirname, '../data/img/' + req.body.name), () => {
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
    console.log("Image deleted : " + req.body.name)
    })
  } 
  res.end();
})

//validation for POST request
function validationPOST(req,res){
  const expectedAttributes = ["url", "name", "alt", "category", "header", "description"]
    Object.keys(req.body).forEach(param => {
      if(!(expectedAttributes.includes(param))){
        res.status(400).end("Attributes incorrect")
      };
    })
    if(req.body.url == null || req.body.url.length === 0){
      res.status(400).end("URL input not provided");
    }
    if(req.body.name == null || req.body.name.length === 0){
      res.status(400).end("Name input not provided");
    }
    if(req.body.alt == null || req.body.name.length === 0){
      res.status(400).end("Alt not provided");
    }
    if(req.body.header == null || req.body.header.length === 0){
      res.status(400).end("Header not provided");
    }
    if(req.body.description == null || req.body.description.length === 0){
      res.status(400).end("Description not provided");
    }
    if(!(["wedding", "christmas", "birthday", "anniversary"].includes(req.body.category))){
      res.status(400).end("Wrong category provided");
      } 
      if(portfoliosArray.find(x => x.name == req.body.name) !== undefined){
        res.status(400).end("Name already in use")
      }
  else{return true}
}

function validationDELETE(req,res,portfoliosArray){  
  const expectedAttributes = ["name"]
  Object.keys(req.body).forEach(param => {
      if(!(expectedAttributes.includes(param))){
        res.status(400).end("Attributes incorrect")
      }
    });
  if(req.body.name == null || req.body.name.length === 0){
      res.status(400).end("Name input not provided");
      }
  if(portfoliosArray.find(x => x.name == req.body.name) === undefined){
    res.status(400).end("Name not in registery")
  }
  else{return true}
}

module.exports = router;