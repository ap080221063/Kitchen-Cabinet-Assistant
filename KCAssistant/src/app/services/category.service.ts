import { Injectable } from '@angular/core';
import { Category } from '../classes/productCategory';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { config } from '../../environments/environment';

@Injectable()
export class CategoryService {

  public categoryList = new Subject<Category[]>();
  public Server = config.serverurl + ':' + config.serverport + '/';

  constructor(private http: HttpClient) { }

  public getAllCategories(): void {
    this.http.get<any>(this.Server + 'categorylist/' + 'all')
            .subscribe(data => this.categoryList.next(data));

  }

  public getActiveCategories(): void {
    this.http.get<any>(this.Server + 'categorylist/' + 'active')
        .subscribe(data => this.categoryList.next(data));
  }

  public removeCategory(catId: number): void {
    this.http.post<any>(this.Server + 'categoryremove/' + catId, '')
            .subscribe(data => this.categoryList.next(data));
  }

  public createUpdateCategory(category: Category): void {
    this.http.post<any>(this.Server + 'categorysave/' + category.id, category)
            .subscribe(data => this.categoryList.next(data));
  }

}
