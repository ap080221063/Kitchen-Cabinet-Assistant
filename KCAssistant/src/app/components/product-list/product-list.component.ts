import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  componentProductList: Product[];

  constructor(private prodService: ProductService) { }

  ngOnInit() {
    this.componentProductList = this.prodService.getAllProducts();
  }

  public addNewProduct() {
    let product: Product;
    product = new Product(0, '', null, 0, 0);

    // make necessary function call to open the add product modal

  }

}
