var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"))
  res.render('home', {array : JSON.parse(data)});
});

router.post('/', jsonParser, function(req,res,next){
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  let array = JSON.parse(rawdata);
  const newArray = array.concat([req.body.newText])
  fs.writeFileSync(path.resolve(__dirname, "../data/introductionArray.json"), JSON.stringify(newArray));
  res.end();
})

router.delete('/',jsonParser,function(req,res,next){
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  let array = JSON.parse(rawdata);
  //if (array contains match), proceed to find index, delete array[index,1], change json file to modified array. If no match, skip.
  if(array.includes(req.body.deleteText)){
    const remove = array.indexOf(req.body.deleteText)
    array.splice(remove,1);
    fs.writeFileSync(path.resolve(__dirname,"../data/introductionArray.json"), JSON.stringify(array))
  }
  res.end()
})

module.exports = router;