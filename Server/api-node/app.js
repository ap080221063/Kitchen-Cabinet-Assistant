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

  // console.log('product with id: '+id);

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

app.post('/productlist', upload.array(), function(req, res) {
  // console.log('product list request');

  var filters = req.body;
  var productdata;
  var productlisttosend = [];
   
  filesystem.readFile('AuxiliaryFiles/products.json', 
     function(err, data) {
       productdata = JSON.parse(data);

       if(!(Object.keys(filters).length === 0 && filters.constructor === Object)){
        
        if(filters.nameFilter != undefined) {
          for(var p = 0; p < productdata.length; p++){
            if(productdata[p].name.toLowerCase().indexOf(filters.nameFilter.toLowerCase()) > -1 && productdata[p].active === true){
              productlisttosend.push(productdata[p]);
            }
          }
        }
        
        if(filters.categoryFilter != undefined){

          if(productlisttosend.length > 0){
            var localProductList = productlisttosend;
            productlisttosend = [];
            for(var p = 0; p < localProductList.length; p++){
              if(localProductList[p].category.id == filters.categoryFilter){
                productlisttosend.push(localProductList[p]);
              }
            }
          }else{
            for(var p = 0; p < productdata.length; p++){
              if(productdata[p].category.id == filters.categoryFilter){
                productlisttosend.push(productdata[p]);
              }
            }
          }
        }

        res.send(productlisttosend);

       } else {
        res.send(productdata);
       }

     });
});

app.get('/images/:imgname', function(req, res) {
  
  var imgnameparam = req.params.imgname;
  
  // console.log('get image: '+imgnameparam);
  filesystem.readFile('AuxiliaryFolder/ProductImages/'+imgnameparam, 
  function(err, data) {   
    res.send(data);
  });

});

app.post('/productremove/:id', function(req, res){ 
  var id = req.params.id;
  // console.log('remove product with id: '+id);
  var filters = req.body;

  var productdata;
  var productdatatosend = [];

  filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

      productdata = JSON.parse(data);

      productdata.forEach(element => {
        if(element.id == id){
          element.active = false;
        }
        
        if(!(Object.keys(filters).length === 0 && filters.constructor === Object)){
            if(element.name.toLowerCase().indexOf(filters.nameFilter.toLowerCase()) > -1 && element.active === true){
              productdatatosend.push(element);
            }
        }else{
          if(element.active == true){
            productdatatosend.push(element);
          }
        }
        
      });
      
      filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
          // if (err) // console.log(err);
          
          // console.log('products file saved');

          res.send(productdatatosend);
      });
  });

});

app.post('/productsave/:id', upload.array(), function(req, res){ 
  var id = req.params.id;
  
  var incommingProductData = req.body.data;
  var incommingFilters = req.body.filters;

  var productdata;
  var productDataRes = [];
  var lastId = 0;

  if (id==0) {
    // console.log('save new product');
    filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

      //parse data on file
      productdata = JSON.parse(data);
      //get last id
      productdata.forEach(element => {
        if (lastId<element.id){
          lastId = element.id;
        }
      });
      //give lastid+1 to new product
      incommingProductData.id = lastId+1;

      //save image in image folder
      require("fs").writeFile("AuxiliaryFolder/ProductImages/"+incommingProductData.imgUrl.filename, incommingProductData.imgUrl.value, 'base64', function(err) {
        // if (err) // console.log(err);
      });
      //delete incommingProductData.imgUrl.value
      incommingProductData.imgUrl.value = '';
      incommingProductData.imgUrl.filename = /*config.url+':'+config.port+*/'images/'+ incommingProductData.imgUrl.filename;
      //add new product to array
      productdata.push(incommingProductData);
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
          // if (err) // console.log(err);
          
          // console.log('products file saved');

          if(!(Object.keys(incommingFilters).length === 0 && incommingFilters.constructor === Object)){
        
            for(var p = 0; p < productdata.length; p++){
              if(productdata[p].name.toLowerCase().indexOf(incommingFilters.nameFilter.toLowerCase()) > -1 && productdata[p].active === true){
                productDataRes.push(productdata[p]);
              }
            }
            res.send(productDataRes);
    
          }else{

            for(var p = 0; p < productdata.length; p++){
              if(productdata[p].active === true){
                productDataRes.push(productdata[p]);
              }
            }
            res.send(productDataRes);

          }
      });
    });
  }else{
    // console.log('update existing product with id: '+id);
    filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

      //parse data on file
      productdata = JSON.parse(data);
      //get last id
      productdata.forEach(element => {
        if (id == element.id){
          element.name = incommingProductData.name;
          element.quantity = incommingProductData.quantity;
          element.category = incommingProductData.category;
          element.shortageQtyWarning = incommingProductData.shortageQtyWarning;

          if(incommingProductData.imgUrl.value != ''){
            //save image in image folder
            require("fs").writeFile("AuxiliaryFolder/ProductImages/" + incommingProductData.imgUrl.filename, incommingProductData.imgUrl.value, 'base64', function(err) {
              // if (err) // console.log(err);
            });
            //delete incommingProductData.imgUrl.value
            incommingProductData.imgUrl.value = '';
            incommingProductData.imgUrl.filename = /*config.url+':'+config.port+*/'images/' + incommingProductData.imgUrl.filename;
          }

          element.imgUrl = incommingProductData.imgUrl;
        }
      });
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/products.json', JSON.stringify(productdata), function(err) {
          // if (err) // console.log(err);
          
          // console.log('products file saved');

          if(!(Object.keys(incommingFilters).length === 0 && incommingFilters.constructor === Object)){
        
            for(var p = 0; p < productdata.length; p++){
              if(productdata[p].name.toLowerCase().indexOf(incommingFilters.nameFilter.toLowerCase()) > -1 && productdata[p].active === true){
                productDataRes.push(productdata[p]);
              }
            }
            res.send(productDataRes);
    
          }else{

            for(var p = 0; p < productdata.length; p++){
              if(productdata[p].active === true){
                productDataRes.push(productdata[p]);
              }
            }
            res.send(productDataRes);

          }
      });
    });
  }
});

app.post('/productsbulksave/', upload.array(), function(req, res){ 
  
  var body = req.body;

  var productdata;
  var productDataRes = [];

  // console.log('save new product');
  filesystem.readFile('AuxiliaryFiles/products.json', 'utf8', function (err, data) {
    // if (err) // console.log(err);

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
        // if (err) // console.log(err);
        
        // console.log('products file saved');

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
app.get('/categorylist/:state', function(req, res) {
  var state = req.params.state;
  // console.log('category list request');

  var categorydata;
    filesystem.readFile('AuxiliaryFiles/categories.json', 
    function(err, data) {
      categorydata = JSON.parse(data);

      if(state == 'undefined' || state == 'all'){
        res.send(categorydata);
      }else if(state == 'active'){
        var auxCategoryData = [];
        categorydata.forEach(element => {
          if(element.active == true){
            auxCategoryData.push(element);
          }
        });
        res.send(auxCategoryData);
      }else if(state == 'quickfilter'){
        var auxCategoryData = [];
        categorydata.forEach(element => {
          if(element.active == true && element.isquickfilter == true){
            auxCategoryData.push(element);
          }
        });
        res.send(auxCategoryData);
      }
    });
});

app.post('/categoryremove/:id', function(req, res){

  var id = req.params.id;
  // console.log('remove category with id: '+id);

  var categorydata;
  var categorydatatosend = [];

  filesystem.readFile('AuxiliaryFiles/categories.json', 'utf8', function (err, data) {
    // if (err) // console.log(err);

    categorydata = JSON.parse(data);

    categorydata.forEach(element => {
      if(element.id != id){
        categorydatatosend.push(element);
      }
    });
    
    filesystem.writeFile ('AuxiliaryFiles/categories.json', JSON.stringify(categorydatatosend), function(err) {
        // if (err) // console.log(err);
        
        // console.log('categories file saved');

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
    // console.log('save new category');
    filesystem.readFile('AuxiliaryFiles/categories.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

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
          // if (err) // console.log(err);
          // console.log('categories file saved');

          categorydata.forEach(element => {
            categoryDataRes.push(element);
          });
          res.send(categoryDataRes);
      });
    });
  }else{
    // console.log('update existing category with id: '+id);
    filesystem.readFile('AuxiliaryFiles/categories.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

      //parse data on file
      categorydata = JSON.parse(data);
      //get last id
      categorydata.forEach(element => {
        if (id == element.id){
          element.name = body.name;
          element.active = body.active;
          element.isquickfilter = body.isquickfilter;
        }
      });
      //save to file
      filesystem.writeFile ('AuxiliaryFiles/categories.json', JSON.stringify(categorydata), function(err) {
          // if (err) // console.log(err);
          // console.log('categories file saved');

          categorydata.forEach(element => {
            categoryDataRes.push(element);
          });
          res.send(categoryDataRes);
      });
    });
  }
});

//emails---------------------------------------------------------------------------
app.get('/emaillist', function(req, res) {
  // console.log('emails list request');

  var emaildata;
    filesystem.readFile('AuxiliaryFiles/emails.json', 
    function(err, data) {
      emaildata = JSON.parse(data);
      res.send(emaildata);
    });
});

app.post('/emailremove/:id', function(req, res){

  var id = req.params.id;
  // console.log('remove email with id: '+id);

  var emaildata;
  var emaildatatosend = [];

  filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
    // if (err) // console.log(err);

    emaildata = JSON.parse(data);

    emaildata.forEach(element => {
      if(element.id != id){
        emaildatatosend.push(element);
      }
    });
    
    filesystem.writeFile ('AuxiliaryFiles/emails.json', JSON.stringify(emaildatatosend), function(err) {
        // if (err) // console.log(err);
        
        // console.log('emails file saved');

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
    // console.log('save new email');
    filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

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
          // if (err) // console.log(err);
          // console.log('emails file saved');

          emaildata.forEach(element => {
            emailDataRes.push(element);
          });
          res.send(emailDataRes);
      });
    });
  }else{
    // console.log('update existing email with id: '+id);
    filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
      // if (err) // console.log(err);

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
          // if (err) // console.log(err);
          // console.log('emails file saved');

          emaildata.forEach(element => {
            emailDataRes.push(element);
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
  var emaildata;
  var productListToSend = [];

  body.forEach(function(item){
    productListToSend.push('<tr><td>'+item.name+'</td><td>'+item.predictToBuy+'</td></tr>');
  });

  filesystem.readFile('AuxiliaryFiles/emails.json', 'utf8', function (err, data) {
    // if (err) // console.log(err);

    emaildata = JSON.parse(data);
    var emailsenders = "";
    var emailreceivers = "";
    
    emaildata.forEach(element => {
      if(element.issender && element.active){
        emailsenders = emailsenders + element.email + ",";
      }
      if(element.isreceiver && element.active){
        emailreceivers = emailreceivers + element.email + ",";
      }
    });

    var send = require('gmail-send')({
      user: config.gmailuser,
      pass: config.gmailpassword,
      to:   emailreceivers,
      from: emailsenders,
      subject: 'Shopping List (' + datetosendText +')',
      html: generateEmailHtml(productListToSend, config.emailtabletemplate)
    })({});

    //send();

  });
});

app.listen(config.port, function() {
  console.log('server online');
  console.log('port: '+ config.port);
});

/*other functions*/ 
function generateEmailHtml(productlist, tabletemplate){

  var htmltable = tabletemplate;
  var rows = "";

  productlist.forEach(element => {
    rows = rows + element;
  });
  
  htmltable = htmltable.replace('@@DYNAMICROWS',rows)
  return htmltable;
}