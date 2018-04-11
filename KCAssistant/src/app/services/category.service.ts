import { Injectable } from '@angular/core';
import { Category } from '../classes/productCategory';
// import { MOCK_PRODUCTS } from '../classes/mock-products';
// import { MOCK_Categories } from '../classes/mock-categories';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable()
export class CategoryService {

  public categoryList = new Subject<Category[]>();
  public Server = 'http://192.168.1.66:8081/';

  constructor(private http: HttpClient) { }

  public getAllCategories(): void {
    this.http.get<any>(this.Server + 'categorylist')
            .subscribe(data => this.categoryList.next(data));

  }

}
