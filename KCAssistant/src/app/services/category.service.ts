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
    this.http.get<any>(this.Server + 'categorylist')
            .subscribe(data => this.categoryList.next(data));

  }

}
