import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SearchandfilterService } from '../../services/searchandfilter.service';

@Component({
  selector: 'app-search-and-filter',
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css']
})
export class SearchAndFilterComponent implements OnInit {

  nameFilter = new Subject<string>();
  categoryFilter = new Subject<string>();

  filterNameObserver = {
    next: x => this.setNFilter(x)
  };

  filterCategoryObserver = {
    next: x => this.setCFilter(x)
  };

  constructor(private searchservice: SearchandfilterService) { }

  clearFilter(): void {
    console.log('searchcomponent->clearfilter');

    this.searchservice.setNameFilter('');
    // this.filterNameObserver.next('');

    this.searchservice.setCategoryFilter('');
    // this.filterCategoryObserver.next('');

  }

  setNFilter(nfilter: string): void {
    console.log('searchcomponent->sendfilter');
    this.searchservice.setNameFilter(nfilter);
  }

  setCFilter(cfilter: string): void {
    console.log('searchcomponent->sendfilter');
    this.searchservice.setCategoryFilter(cfilter);
  }

  ngOnInit() {
    this.nameFilter.subscribe(this.filterNameObserver);
    this.categoryFilter.subscribe(this.filterCategoryObserver);
  }

}
