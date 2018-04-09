var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var filesystem = require('fs');
var request = require('request');

var app = express();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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

app.get('/categorylist', function(req, res) {
  console.log('categorylist');

  var categorydata;
   filesystem.readFile('AuxiliaryFiles/categories.json', 
    function(err, data) {
      categorydata = JSON.parse(data);
      res.send(categorydata);
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

app.get('/images/:imgname', function(req, res) {
  
  var imgnameparam = req.params.imgname;
  
  console.log('get image: '+imgnameparam);
  filesystem.readFile('AuxiliaryFolder/ProductImages/'+imgnameparam, 
  function(err, data) {   
    res.send(data);
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

      //save image in image folder
      require("fs").writeFile("Auxiliaryfolder/ProductImages/"+body.imgUrl.filename, body.imgUrl.value, 'base64', function(err) {
        console.log(err);
      });
      //delete body.imgUrl.value
      body.imgUrl.value = '';
      
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

          if(body.imgUrl.value != ''){
            //save image in image folder
            require("fs").writeFile("Auxiliaryfolder/ProductImages/"+body.imgUrl.filename, body.imgUrl.value, 'base64', function(err) {
              console.log(err);
            });
            //delete body.imgUrl.value
            body.imgUrl.value = '';
          }

          element.imgUrl = body.imgUrl;
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

app.post('/sendshoppinglist/', upload.array(), function(req, res){

  var body = req.body;
  var datetosend = new Date();
  var datetosendText = (datetosend.getDate() + '-' + (datetosend.getMonth()+1) + '-' + datetosend.getFullYear());

  var productListToSend = 'Product List: \n';

  body.forEach(function(item){
    productListToSend += item.name + ' -> ' + item.predictToBuy + '\n'; 
  });

  console.log('before send');

  var send = require('gmail-send')({
    //var send = require('../index.js')({
      user: '<>',
      // user: credentials.user,                  // Your GMail account used to send emails
      pass: '<>',
      // pass: credentials.pass,                  // Application-specific password
      to:   '<>',
      // to:   credentials.user,                  // Send to yourself
                                               // you also may set array of recipients:
                                               // [ 'user1@gmail.com', 'user2@gmail.com' ]
      // from:    credentials.user,            // from: by default equals to user
      // replyTo: credentials.user,            // replyTo: by default undefined
      // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
      subject: 'Lista de compras (' + datetosendText +')',
      text:    productListToSend,         // Plain text
      //html:    '<b>html text</b>'            // HTML
    });

    send();

    console.log('after send');

});

app.listen(8081, function() {
  console.log('server online');
  console.log('port: 8081');
});