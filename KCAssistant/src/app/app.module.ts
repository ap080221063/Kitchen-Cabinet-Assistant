import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SearchAndFilterComponentComponent } from './components/search-and-filter-component/search-and-filter-component.component';
import { ProductListComponentComponent } from './components/product-list-component/product-list-component.component';
import { ProductComponentComponent } from './components/product-component/product-component.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchAndFilterComponentComponent,
    ProductListComponentComponent,
    ProductComponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
