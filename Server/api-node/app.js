var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var filesystem = require('fs');
var request = require('request');

var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var upload = multer();

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

app.post('/productremove/:id', function(req, res){ 
  var id = req.params.id;

  console.log('remove with id: '+id);

  var productdata;
  var productdatatosend = [];

  filesystem.readFile('AuxiliaryFiles/data.json', 'utf8', function (err, data) {
      if (err) throw err;

      productdata = JSON.parse(data);

      productdata.forEach(element => {
        if(element.id == id){
          element.active = false;
        }
        
        if(element.active == true){
          productdatatosend.push(element);
        }
      });
      
      filesystem.writeFile ('AuxiliaryFiles/data.json', JSON.stringify(productdata), function(err) {
          if (err) throw err;
          console.log('file saved');

          res.send(productdatatosend);
      });
  });

});

app.post('/productsave/:id', upload.array(), function(req, res){ 
  var id = req.params.id;
  
  var body = req.body;

  var productdata;
  var productDataRes = [];
  var lastId = 0;

  if (id==0) {
    console.log('save new');
    filesystem.readFile('AuxiliaryFiles/data.json', 'utf8', function (err, data) {
      if (err) throw err;

      //parse data on file
      productdata = JSON.parse(data);
      //get last id
      productdata.forEach(element => {
        if (lastId<element.id){
          lastId = element.id;
        }
      });
      //give lastid+1 to new product
      body.id = lastId+1;
      //add new product to array
      productdata.push(body);
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/data.json', JSON.stringify(productdata), function(err) {
          if (err) throw err;
          console.log('file saved');

          productdata.forEach(element => {
            if(element.active === true){
              productDataRes.push(element);
            }
          });
          res.send(productDataRes);
      });
    });
  }else{
    console.log('update existing with id: '+id);
    filesystem.readFile('AuxiliaryFiles/data.json', 'utf8', function (err, data) {
      if (err) throw err;

      //parse data on file
      productdata = JSON.parse(data);
      //get last id
      productdata.forEach(element => {
        if (id == element.id){
          element.name = body.name;
          element.quantity = body.quantity;
          element.category = body.category;
          element.shortageQtyWarning = body.shortageQtyWarning;
        }
      });
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/data.json', JSON.stringify(productdata), function(err) {
          if (err) throw err;
          console.log('file saved');

          productdata.forEach(element => {
            if(element.active === true){
              productDataRes.push(element);
            }
          });
          res.send(productDataRes);
      });
    });
  }
});

app.post('/productsbulksave/', upload.array(), function(req, res){ 
 
  var body = req.body;

  var productdata;
  var productDataRes = [];

  console.log('save new');
  filesystem.readFile('AuxiliaryFiles/data.json', 'utf8', function (err, data) {
    if (err) throw err;

    //parse data on file
    productdata = JSON.parse(data);
    //get last id
    productdata.forEach(prdl => {
      body.forEach(ndl => {
        if (prdl.id == ndl.id){
          prdl.quantity = prdl.quantity + ndl.predictToBuy;
        }
      })
    });

    //save to file
    filesystem.writeFile ('AuxiliaryFiles/data.json', JSON.stringify(productdata), function(err) {
        if (err) throw err;
        console.log('file saved');

        productdata.forEach(element => {
          if(element.active === true){
            productDataRes.push(element);
          }
        });
        res.send(productDataRes);
    });
  });
});


app.listen(8081, function() {
  console.log('server online');
  console.log('port: 8081');
});