import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchAndFilterComponent } from './components/search-and-filter/search-and-filter.component';
import { ProductComponent } from './components/product/product.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { SearchandfilterService } from './services/searchandfilter.service';
import { EmailService } from './services/email.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SettingsComponent } from './components/settings/settings.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImageComponent } from './components/shared/image/image.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchAndFilterComponent,
    ProductComponent,
    ProductListComponent,
    SpinnerComponent,
    ShoppingListComponent,
    SettingsComponent,
    ImageComponent,
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    HttpClientModule,
    LazyLoadImageModule,
  ],
  providers: [
    ProductService,
    CategoryService,
    EmailService,
    SearchandfilterService,
    HttpClientModule,
    HttpClient
  ],
  bootstrap: [AppComponent],
  entryComponents: [
     ProductComponent,
     ShoppingListComponent,
     SettingsComponent
  ]
})
export class AppModule { }
