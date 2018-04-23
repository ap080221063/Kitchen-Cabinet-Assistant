# Kitchen Cabinet Assistant

_KCA_ is an application to help manage a kitchen's cabinet with the inbound and outbound of products, keeping track of stock and other features like creating shopping lists. Although the name suggests a Kitchen, KCA can be adapted to any other house divisions or all at the same time as products can be categorized accordingly. 

It is intended to be a user friendly and very straight foward app and multi-device responsive. The goal is a better management and a day-to-day helper with the stock of products at home and the challange is to making this simpler to use than the traditional paper and pencil check list.

## Main features

* Products management (CUD);
* Product categories management (CUD);
* Quick search box;
* Shopping list creation based on the quantity shortage number defined for each product;
* One-click email shopping list to relying email addresses;

## Installation

* Front-end is implemented with Angular CLI and other node modules, installation info [here](https://github.com/ap080221063/Kitchen-Cabinet-Assistant/blob/master/KCAssistant/README.md);
* Back end is a REST API implemented with Node.js, and acting as a webserver, installation info [here](https://github.com/ap080221063/Kitchen-Cabinet-Assistant/blob/master/Server/README.md);
  * There is no database in this project. Data persistance is done using .json files;
* ###### Raspberry Pi installation walkthrough
  * A walkthrough on how to configure a raspberry pi as a webserver to deliver this project at home can be found [here](https://github.com/ap080221063/Kitchen-Cabinet-Assistant/blob/master/Raspberry%20Pi%20Configuration%20Guide.pdf);

## Future development/derivation/upgrade features

* Adding a barcode property to the product would provide an additional identifier to:
  * Uploading a .json or .xml file with a list of barcodes and quantities that could perform a bulk update;
  * Barcode picking each product, with a barcode reader pistol, could send a POST request to update a product;
  * With the correct integration, the product's price/image/caracteristics would be always up to date;
* Change the email module (gmail-send), as it restricts the email account that sends the shopping list as being necessarilly a Gmail account.
* ~~Give the product's category classification a true meaning by allowing the user to filter by product category. This will also end with the tiresome typing each time we need to search a product.~~ [Implemented]
* Lazy loading the products in the product list would have a better performance and should be one of the next steps. It would reduce the amount of images rendered and the quantity of data pulled from the server.

## Application images

<img src="https://github.com/ap080221063/Kitchen-Cabinet-Assistant/blob/master/Design%26Mockups/development/1.PNG" width="530" height="400" />

<img src="https://github.com/ap080221063/Kitchen-Cabinet-Assistant/blob/master/Design%26Mockups/development/5.PNG" width="530" height="400" />

<img src="https://github.com/ap080221063/Kitchen-Cabinet-Assistant/blob/master/Design%26Mockups/development/2.PNG" width="530" height="400" />
