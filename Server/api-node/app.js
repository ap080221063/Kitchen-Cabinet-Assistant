var express = require('express');
var bodyParser = require('body-parser');
var filesystem = require('fs');
var app = express();

app.use(bodyParser.json());

app.get('/product/:id', function(req, res) {
  var id = req.params.id;

  var productdata;
  var product;
  //get product data by id
   filesystem.readFile('AuxiliaryFiles/data.json', 
    function(err, data) {
      productdata = JSON.parse(data);

      for(var p = 0; p < productdata.length; p++){
        if(productdata[p].id==id){
            product = productdata[p];
        }
      }

      res.send(product);
    });
});

app.get('/productlist', function(req, res) {
  var productdata;
  //get product data by id
   filesystem.readFile('AuxiliaryFiles/data.json', 
    function(err, data) {
      productdata = JSON.parse(data);
      res.send(productdata);
    });
});

app.listen(8081, function() {
  console.log('server online');
  console.log('port: 8081');
});