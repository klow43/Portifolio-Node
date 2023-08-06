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
  if(portfoliosArray.filter(x => x.name === req.body.name).length == 0){
    download(req.body.url, req.body.name, function(){
      console.log('done');
    });
    const newArray = portfoliosArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});

router.delete('/', jsonParser, function(req, res, next){
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  const newArray = portfoliosArray.filter(x => x.name !== req.body.name)
  if(newArray.length !== portfoliosArray.length){
    fs.unlink(path.resolve(__dirname, '../data/img/' + req.body.name), () => {
      console.log(req.body.name + "deleted!");
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
})

module.exports = router;