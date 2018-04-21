import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SearchandfilterService } from '../../services/searchandfilter.service';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs/Subscription';
import { Category } from '../../classes/productCategory';

@Component({
  selector: 'app-search-and-filter',
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css']
})
export class SearchAndFilterComponent implements OnInit, OnDestroy {

  nameFilter = new Subject<string>();
  categoryFilter = new Subject<string>();

  categoryListSubscription: Subscription;
  categoryList: Category[];

  filterNameObserver = {
    next: x => this.setNFilter(x)
  };

  filterCategoryObserver = {
    next: x => this.setCFilter(x)
  };

  constructor(private searchservice: SearchandfilterService,
              private categoryservice: CategoryService) {

    this.categoryListSubscription = this.categoryservice.categoryQuickFilterList
      .subscribe(categories => { this.categoryList = categories; });

  }

  ngOnInit() {
    this.nameFilter.subscribe(this.filterNameObserver);
    this.categoryFilter.subscribe(this.filterCategoryObserver);

    setTimeout(() => this.categoryservice.getQuickFilterCategories());

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.categoryListSubscription.unsubscribe();
  }

  clearFilter(): void {
    console.log('searchcomponent->clearfilter');

    this.searchservice.setNameFilter('');
    this.searchservice.setCategoryFilter('');
  }

  setNFilter(nfilter: string): void {
    console.log('searchcomponent->sendfilter');
    this.searchservice.setNameFilter(nfilter);
  }

  setCFilter(cfilter: string): void {
    console.log('searchcomponent->sendfilter');
    this.searchservice.setCategoryFilter(cfilter);
  }

}
