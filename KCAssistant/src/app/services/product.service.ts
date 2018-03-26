import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { MOCK_PRODUCTS } from '../classes/mock-products';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

    import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
    import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {

  private productList = new Subject<Product[]>();

      public Server = 'http://localhost:8081/';
      public ApiUrl = 'productlist';
      public ServerWithApiUrl = this.Server + this.ApiUrl;

  constructor(private http: HttpClient) { }

  public getActiveProducts(): Observable<Product[]> {
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    this.http.get<any>(this.ServerWithApiUrl);

    for (const p of MOCK_PRODUCTS) { // get data from the dbase
      if (p.active === true) {
        productAuxList.push(p);
      }
    }

    this.productList.next(productAuxList);
    return this.productList.asObservable();
  }

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

      if (p.active === true) {
        productAuxList.push(p);
      }
    }

    this.productList.next(productAuxList);
  }

  public clearFilter() {
    this.getActiveProducts();
  }

  public sendFilteredProductList(filter: string) {
    if (filter === null || filter === '' ) {
      this.getActiveProducts();
    } else {
      let productAuxList: Product[];
      productAuxList = new Array<Product>();

      MOCK_PRODUCTS.forEach(e => {
        if (e.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 && e.active === true) {
          productAuxList.push(e);
        }
      });

    this.productList.next(productAuxList);
    }
  }

}
