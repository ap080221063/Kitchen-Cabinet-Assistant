import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-search-and-filter',
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css']
})
export class SearchAndFilterComponent implements OnInit {

  constructor(private productservice: ProductService) { }

  myObservable = new Subject<string>();
  // Create observer object
  myObserver = {
    next: x => this.sendFilter(x), // console.log('Observer got a next value: ' + x),
    // error: err => console.error('Observer got an error: ' + err),
    // complete: () => console.log('Observer got a complete notification'),
  };

  clearFilter(): void {
    console.log('searchcomponent->clearfilter');
    this.myObservable.next(undefined);
    this.productservice.clearFilter();
  }

  sendFilter(input): void {
    console.log('searchcomponent->sendfilter');
    this.productservice.sendFilteredProductList(input);
  }

  ngOnInit() {
    this.myObservable.subscribe(this.myObserver);
  }

}
