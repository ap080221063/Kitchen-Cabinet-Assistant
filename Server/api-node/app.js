var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var filesystem = require('fs');
var request = require('request');
var config = require('./config');

var app = express();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
    
var upload = multer();

//products-------------------------------------------------------------------------
app.get('/product/:id', function(req, res) {
  var id = req.params.id;

  console.log('product with id: '+id);

  var productdata;
  var product;
  //get product data by id
    filesystem.readFile('AuxiliaryFiles/products.json', 
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
  console.log('product list request');

  var productdata;
  //get product data by id
    filesystem.readFile('AuxiliaryFiles/products.json', 
    function(err, data) {
      productdata = JSON.parse(data);
      res.send(productdata);
    });
});

app.get('/productlist/filter/:filterparam', function(req, res) {
  
  var filterparam = req.params.filterparam;
  
  console.log('product list with filter: '+filterparam);

  var productdata;
  var productlisttosend = [];
  //get product data by id
    filesystem.readFile('AuxiliaryFiles/products.json', 
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
  console.log('remove product with id: '+id);

  var productdata;
  var productdatatosend = [];

  filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
      if (err) console.log(err);

      productdata = JSON.parse(data);

      productdata.forEach(element => {
        if(element.id == id){
          element.active = false;
        }
        
        if(element.active == true){
          productdatatosend.push(element);
        }
      });
      
      filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
          if (err) console.log(err);
          
          console.log('products file saved');

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
    console.log('save new product');
    filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
      if (err) console.log(err);

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
        if (err) console.log(err);
      });
      //delete body.imgUrl.value
      body.imgUrl.value = '';
      body.imgUrl.filename = /*config.url+':'+config.port+*/'images/'+ body.imgUrl.filename;
      //add new product to array
      productdata.push(body);
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
          if (err) console.log(err);
          
          console.log('products file saved');

          productdata.forEach(element => {
            if(element.active === true){
              productDataRes.push(element);
            }
          });
          res.send(productDataRes);
      });
    });
  }else{
    console.log('update existing product with id: '+id);
    filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
      if (err) console.log(err);

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
            require("fs").writeFile("Auxiliaryfolder/ProductImages/" + body.imgUrl.filename, body.imgUrl.value, 'base64', function(err) {
              if (err) console.log(err);
            });
            //delete body.imgUrl.value
            body.imgUrl.value = '';
            body.imgUrl.filename = /*config.url+':'+config.port+*/'images/' + body.imgUrl.filename;
          }

          element.imgUrl = body.imgUrl;
        }
      });
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
          if (err) console.log(err);
          
          console.log('products file saved');

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

  console.log('save new product');
  filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
    if (err) console.log(err);

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
    filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
        if (err) console.log(err);
        
        console.log('products file saved');

        productdata.forEach(element => {
          if(element.active === true){
            productDataRes.push(element);
          }
        });
        res.send(productDataRes);
    });
  });
});

//categories-----------------------------------------------------------------------
app.get('/categorylist', function(req, res) {
  console.log('category list request');

  var categorydata;
    filesystem.readFile('AuxiliaryFiles/categories.json', 
    function(err, data) {
      categorydata = JSON.parse(data);
      res.send(categorydata);
    });
});

app.post('/categoryremove/:id', function(req, res){

  var id = req.params.id;
  console.log('remove category with id: '+id);

  var categorydata;
  var categorydatatosend = [];

  filesystem.readFile('AuxiliaryFiles/categories.json', 'utf8', function (err, data) {
    if (err) console.log(err);

    categorydata = JSON.parse(data);

    categorydata.forEach(element => {
      if(element.id != id){
        categorydatatosend.push(element);
      }
    });
    
    filesystem.writeFile ('AuxiliaryFiles/categories.json', JSON.stringify(categorydatatosend), function(err) {
        if (err) console.log(err);
        
        console.log('categories file saved');

        res.send(categorydatatosend);
    });
  });

});

app.post('/categorysave/:id', upload.array(), function(req, res){ 
  var id = req.params.id;
  
  var body = req.body;

  var categorydata;
  var categoryDataRes = [];
  var lastId = 0;

  if (id==0) {
    console.log('save new category');
    filesystem.readFile('AuxiliaryFiles/categories.json', 'utf8', function (err, data) {
      if (err) console.log(err);

      //parse data on file
      categorydata = JSON.parse(data);
      //get last id
      categorydata.forEach(element => {
        if (lastId<element.id){
          lastId = element.id;
        }
      });
      //give lastid+1 to new category
      body.id = lastId+1;

      //add new category to array
      categorydata.push(body);
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/categories.json', JSON.stringify(categorydata), function(err) {
          if (err) console.log(err);
          console.log('categories file saved');

          categorydata.forEach(element => {
            if(element.active === true){
              categoryDataRes.push(element);
            }
          });
          res.send(categoryDataRes);
      });
    });
  }else{
    console.log('update existing category with id: '+id);
    filesystem.readFile('AuxiliaryFiles/categories.json', 'utf8', function (err, data) {
      if (err) console.log(err);

      //parse data on file
      categorydata = JSON.parse(data);
      //get last id
      categorydata.forEach(element => {
        if (id == element.id){
          element.name = body.name;
          element.active = body.active;
        }
      });
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/categories.json', JSON.stringify(categorydata), function(err) {
          if (err) console.log(err);
          console.log('categories file saved');

          categorydata.forEach(element => {
            if(element.active === true){
              categoryDataRes.push(element);
            }
          });
          res.send(categoryDataRes);
      });
    });
  }
});

//emails---------------------------------------------------------------------------
app.get('/emaillist', function(req, res) {
  console.log('emails list request');

  var emaildata;
    filesystem.readFile('AuxiliaryFiles/emails.json', 
    function(err, data) {
      emaildata = JSON.parse(data);
      res.send(emaildata);
    });
});

app.post('/emailremove/:id', function(req, res){

  var id = req.params.id;
  console.log('remove email with id: '+id);

  var emaildata;
  var emaildatatosend = [];

  filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
    if (err) console.log(err);

    emaildata = JSON.parse(data);

    emaildata.forEach(element => {
      if(element.id != id){
        emaildatatosend.push(element);
      }
    });
    
    filesystem.writeFile ('AuxiliaryFiles/emails.json', JSON.stringify(emaildatatosend), function(err) {
        if (err) console.log(err);
        
        console.log('emails file saved');

        res.send(emaildatatosend);
    });
  });

});

app.post('/emailsave/:id', upload.array(), function(req, res){ 
  var id = req.params.id;
  
  var body = req.body;

  var emaildata;
  var emailDataRes = [];
  var lastId = 0;

  if (id==0) {
    console.log('save new email');
    filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
      if (err) console.log(err);

      //parse data on file
      emaildata = JSON.parse(data);
      //get last id
      emaildata.forEach(element => {
        if (lastId<element.id){
          lastId = element.id;
        }
      });
      //give lastid+1 to new emails
      body.id = lastId+1;

      //add new emails to array
      emaildata.push(body);
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/emails.json', JSON.stringify(emaildata), function(err) {
          if (err) console.log(err);
          console.log('emails file saved');

          emaildata.forEach(element => {
            if(element.active === true){
              emailDataRes.push(element);
            }
          });
          res.send(emailDataRes);
      });
    });
  }else{
    console.log('update existing email with id: '+id);
    filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
      if (err) console.log(err);

      //parse data on file
      emaildata = JSON.parse(data);
      //get last id
      emaildata.forEach(element => {
        if (id == element.id){
          element.name = body.name;
          element.active = body.active;
          element.issender = body.issender;
          element.isreceiver = body.isreceiver;
        }
      });
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/emails.json', JSON.stringify(emaildata), function(err) {
          if (err) console.log(err);
          console.log('emails file saved');

          emaildata.forEach(element => {
            if(element.active === true){
              emailDataRes.push(element);
            }
          });
          res.send(emailDataRes);
      });
    });
  }
});

//other----------------------------------------------------------------------------
app.post('/sendshoppinglist/', upload.array(), function(req, res){

  var body = req.body;
  var datetosend = new Date();
  var datetosendText = (datetosend.getDate() + '-' + (datetosend.getMonth()+1) + '-' + datetosend.getFullYear());

  var productListToSend = 'Product List: \n';

  body.forEach(function(item){
    productListToSend += item.name + ' -> ' + item.predictToBuy + '\n'; 
  });

  var send = require('gmail-send')({
      user: config.gmailuser,
      pass: config.gmailpassword,
      to:   config.emailrecipients,
      subject: 'Lista de compras (' + datetosendText +')',
      text:    productListToSend,
      //html:    '<b>html text</b>'            // HTML
    });

    send();

});

app.listen(config.port, function() {
  console.log('server online');
  console.log('port: '+ config.port);
});

