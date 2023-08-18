const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedIn = ensureLogIn();

/* GET recommendations page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"))
  res.render('recommendations', {data: JSON.parse(data)});
});

router.post('/', jsonParser, function(req, res, next) {
let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
let recommendationsArray = JSON.parse(rawdata);  
if(validationPOST(req,res) == true){  
  if(recommendationsArray.filter(x => x.name === req.body.name).length == 0) {
    const newArray = recommendationsArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));  
      };
    };
  res.end() 
});

router.delete('/', jsonParser, ensureLoggedIn, function(req,res,next){
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);
  const newArray = recommendationsArray.filter(x => x.name !== req.body.name)
  if(validationDELETE(req,res) == true){
      if(newArray.lenght !== recommendationsArray.length) {
      fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));
      };
    };
  res.end();
});

//validate POST input
function validationPOST(req,res){
  const expectedAttribute = ["avatar", "name", "role", "description"]
 //checking if wrong keys in request
  Object.keys(req.body).forEach(param => {
    if(!(expectedAttribute.includes(param))){
      res.status(400).end("Wrong atttributes" + param);
    }
  });
    //name is null or empty
    if(req.body.name == null || req.body.name.length === 0){
      res.status(400).end("Name not provided");
    }
    //role is null or empty
    if(req.body.role == null || req.body.role.length === 0  ){
      res.status(400).end("Role not provided");
    }
    //description null or empty
    if(req.body.description == null || req.body.description.length === 0){
      res.status(400).end("Description not provided");
    }
    //avatar not included in body or contains off limit number.
    if(!([1,2,3].includes(req.body.avatar))){
      res.status(400).end("Wrong/No avatar provided");
    }
  else{return true}
}

//validation for DELETE request
function validationDELETE(req,res){
  if(req.body.name == null || req.body.name.length === 0){
    res.status(400).end("Name not provided");
  }
  else{return true}
}

module.exports = router;