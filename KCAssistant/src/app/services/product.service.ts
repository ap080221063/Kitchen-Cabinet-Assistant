import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { MOCK_PRODUCTS } from '../classes/mock-products';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ProductService {

  private productList = new Subject<Product[]>();

  constructor() { }

  public getAllProducts(): Observable<Product[]> {
    let productlist: Product[];
    productlist = new Array<Product>();

    for (const p of MOCK_PRODUCTS) {
      productlist.push(p);
    }

    this.productList.next(productlist);
    return this.productList.asObservable();
  }

}
