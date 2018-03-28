var express = require('express');
var bodyParser = require('body-parser');
var filesystem = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/product/:id', function(req, res) {
  var id = req.params.id;

  console.log('product with id: '+id);

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
  console.log('productlist');

  var productdata;
  //get product data by id
   filesystem.readFile('AuxiliaryFiles/data.json', 
    function(err, data) {
      productdata = JSON.parse(data);
      res.send(productdata);
    });
});

app.get('/productlist/filter/:filterparam', function(req, res) {
  
  var filterparam = req.params.filterparam;
  
  console.log('productlist with filter: '+filterparam);

  var productdata;
  var productlisttosend = [];
  //get product data by id
   filesystem.readFile('AuxiliaryFiles/data.json', 
    function(err, data) {
      productdata = JSON.parse(data);
      
      for(var p = 0; p < productdata.length; p++){
        if(productdata[p].name.toLowerCase().indexOf(filterparam.toLowerCase()) > -1 && productdata[p].active === true){
          productlisttosend.push(productdata[p]);
        }
      }
      
      res.send(productlisttosend);
    });
});

app.listen(8081, function() {
  console.log('server online');
  console.log('port: 8081');
});