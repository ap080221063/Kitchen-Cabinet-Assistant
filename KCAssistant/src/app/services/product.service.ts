import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { MOCK_PRODUCTS } from '../classes/mock-products';
// to be removed, testing purpose only

@Injectable()
export class ProductService {

  constructor() { }

  public getAllProducts(): Product[] {
    let productlist: Product[];
    productlist = new Array<Product>();

    for (const p of MOCK_PRODUCTS) {
      productlist.push(p);
    }

    return productlist;
  }

}
