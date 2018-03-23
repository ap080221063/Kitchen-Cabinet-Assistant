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
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    for (const p of MOCK_PRODUCTS) { // get data from the dbase
      productAuxList.push(p);
    }

    this.productList.next(productAuxList);
    return this.productList.asObservable();
  }

  public getNeededProducts(): Array<Product> {
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    for (const p of MOCK_PRODUCTS) { // get data from the dbase
      if (p.quantity <= p.shortageQtyWarning && p.active === true) {
        p.predictToBuy = (p.shortageQtyWarning - p.quantity) + 1;
        productAuxList.push(p);
      }
    }

    return productAuxList;
  }

  public addProduct(product: Product): void {
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    for (const p of MOCK_PRODUCTS) { // get data from the dbase
      if (p.id === product.id) {
        p.quantity = p.quantity + product.predictToBuy;
      }
      productAuxList.push(p);
    }

    this.productList.next(productAuxList);
  }

  public clearFilter() {
    this.getAllProducts();
  }

  public sendFilteredProductList(filter: string) {
    if (filter === null || filter === '' ) {
      this.getAllProducts();
    } else {
      let productAuxList: Product[];
      productAuxList = new Array<Product>();

      MOCK_PRODUCTS.forEach(e => {
        if (e.name.startsWith(filter)) {
          productAuxList.push(e);
        }
      });

    this.productList.next(productAuxList);
    }
  }

}
