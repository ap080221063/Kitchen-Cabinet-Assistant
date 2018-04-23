import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SearchandfilterService {

  public sharedNameFilter = new Subject<string>();
  public sharedCategoryFilter = new Subject<number>();

  constructor() { }

  public setNameFilter(filter: string): void {
    console.log('search service -> name filter = ' + filter );
    this.sharedNameFilter.next(filter);
  }

  public setCategoryFilter(filter: number): void {
    console.log('search service -> category filter = ' + filter );
    this.sharedCategoryFilter.next(filter);
  }

}
