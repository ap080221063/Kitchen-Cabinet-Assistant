import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { config } from '../../environments/environment';
import { SearchandfilterService } from './searchandfilter.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ProductService {

  public product = new Subject<Product>();
  public productList = new Subject<Product[]>();
  public neededProductsList = new Subject<Product[]>();
  public Server = config.serverurl + ':' + config.serverport + '/';

  private localList: Array<Product>;

  private nameFilterSubscription: Subscription;
  private nameFilter: string;
  private categoryFilterSubscription: Subscription;
  private categoryFilter: number;

  constructor(private http: HttpClient, private searchservice: SearchandfilterService) {

    this.nameFilterSubscription = this.searchservice.sharedNameFilter
    .subscribe(nf => {this.nameFilter = nf; });

    this.categoryFilterSubscription = this.searchservice.sharedCategoryFilter
    .subscribe(nf => {this.categoryFilter = nf; });

   }

  public getActiveProducts(): void {
    this.http.post<any>(this.Server + 'productlist', this.getFiltersObject())
            .subscribe(data => this.productList.next(this.activeList(data)));

  }

  public getProduct(id: number): void {
    this.http.get<any>(this.Server + 'product/' + id)
            .subscribe(data => this.product.next(data));
  }

  public getNeededProducts(): void {
     this.http.post<any>(this.Server + 'productlist', '')
            .subscribe(data => this.neededProductsList.next(this.neededList(data)));

  }

  public productBulkAdd(productsToAddList: Product[]): void {
    this.http.post<any>(this.Server + 'productsbulksave', productsToAddList)
    .subscribe(data => this.productList.next(data));
  }

  public removeProduct(prodId: number): void {
    this.http.post<any>(this.Server + 'productremove/' + prodId, this.getFiltersObject())
            .subscribe(data => this.productList.next(data));
  }

  public createUpdateProduct(product: Product): void {
    this.http.post<any>(this.Server + 'productsave/' + product.id, this.getDataObjectWithFilters(product))
            .subscribe(data => this.productList.next(data));
  }

  public clearFilter() {
    this.searchservice.setNameFilter('');
    this.searchservice.setCategoryFilter(0);
    this.getActiveProducts();
  }

  public sendShoppingListEmail(productsToAddList: Product[]): void {
    this.http.post<any>(this.Server + 'sendshoppinglist', productsToAddList).subscribe();
  }

  // private auxiliary methods

  private activeList(pArray: Array<Product>): Array<Product> {
    console.log(pArray);
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

  private getFiltersObject(): Object {
    let filters: Object;
    filters = {'nameFilter': this.nameFilter, 'categoryFilter': this.categoryFilter};

    return filters;
  }

  private getDataObjectWithFilters(objIn: any): Object {
    let dataObject: Object;
    dataObject = {'data': objIn, 'filters': this.getFiltersObject()};

    return dataObject;
  }

}
