import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { Translation } from '../../classes/translation';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  componentProduct: Product;
  componentTranslations: Translation[];

  constructor() { }

  ngOnInit() {
  }

  public save() {
    if (this.componentProduct.id = 0) {
      // save as new
    } else {
      // save existing
    }
  }

  public delete() {
    this.componentProduct.active = false;
  }



}
