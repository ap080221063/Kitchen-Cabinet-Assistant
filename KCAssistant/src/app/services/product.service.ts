import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
// import { MOCK_PRODUCTS } from '../classes/mock-products';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {

  public product = new Subject<Product>();
  public productList = new Subject<Product[]>();
  public neededProductsList = new Subject<Product[]>();

  private localList: Array<Product>;

  public Server = 'http://localhost:8081/';

  constructor(private http: HttpClient) { }

  public getActiveProducts(): void {
    this.http.get<any>(this.Server + 'productlist')
            .subscribe(data => this.productList.next(this.activeList(data)));

  }

  public getProduct(id: number): void {
    this.http.get<any>(this.Server + 'product/' + id)
            .subscribe(data => this.product.next(data));
  }

  // public getAllProducts(): void {
  //   this.http.get<any>(this.Server + 'productlist')
  //           .subscribe(data => this.productList.next(data));
  // }

  public getNeededProducts(): void {
     this.http.get<any>(this.Server + 'productlist')
            .subscribe(data => this.neededProductsList.next(this.neededList(data)));

  }

  public productBulkAdd(productsToAddList: Product[]): void {
    this.http.post<any>(this.Server + 'productsbulksave', productsToAddList)
    .subscribe(data => this.productList.next(data));
  }

  public removeProduct(prodId: number): void {
    this.http.post<any>(this.Server + 'productremove/' + prodId, '')
            .subscribe(data => this.productList.next(data));
  }

  public createUpdateProduct(product: Product): void {
    this.http.post<any>(this.Server + 'productsave/' + product.id, product)
            .subscribe(data => this.productList.next(data));
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

       this.http.get<any>(this.Server + 'productlist/filter/' + filter)
        .subscribe(data => this.productList.next(data));
    }
  }

  // private auxiliary methods

  private activeList(pArray: Array<Product>): Array<Product> {
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    pArray.forEach(e => {
      if (e.active === true) {
        productAuxList.push(e);
      }
    });

    this.localList = productAuxList;

    return productAuxList;
  }

  private neededList(pArray: Array<Product>): Array<Product> {
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    pArray.forEach(e => {
      if (e.quantity <= e.shortageQtyWarning && e.active === true) {
        e.predictToBuy = (e.shortageQtyWarning - e.quantity) + 1;
        productAuxList.push(e);
      }
    });

    return productAuxList;
  }

  private addtoList(pArray: Array<Product>, prodToAdd: Product): Array<Product> {
    let productAuxList: Product[];
    productAuxList = new Array<Product>();

    pArray.forEach(e => {
      if (e.id === prodToAdd.id) {
        e.quantity = e.quantity + prodToAdd.predictToBuy;
      }

      if (e.active === true) {
        productAuxList.push(e);
      }
    });

    return productAuxList;
  }

}
