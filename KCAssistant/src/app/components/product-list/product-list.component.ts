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
  removeProductBtnVisible: boolean;

  constructor(private prodService: ProductService) {
    this.removeProductBtnVisible = false;
  }

  ngOnInit() {
    this.componentProductList = this.prodService.getAllProducts();
  }

  public addNewProduct() {
    let product: Product;
    product = new Product(0, '', null, 0, 0);

    // make necessary function call to open the add product modal

  }

  public removeProductButtonVisibleToggle() {
    let aux: boolean;
    aux = !this.removeProductBtnVisible;
    this.removeProductBtnVisible = aux;
  }

  public removeProduct(prodId: number) {
    let componentProductListAux: Product[];
    componentProductListAux = this.componentProductList;

    componentProductListAux.splice(this.componentProductList.findIndex(y => y.id === prodId), 1);

    this.componentProductList = componentProductListAux;

  }

  public productDetails(prodId: number) {

    // make necessary function call to open the add product modal

  }

  public alterProductQty(type: string, prodId: number) {
    for (const iterProduct of this.componentProductList) {
      if (iterProduct.id === prodId) {
        if (type === 'add') {
          iterProduct.quantity = iterProduct.quantity + 1;
        } else {
          if (iterProduct.quantity > 0) {
            iterProduct.quantity = iterProduct.quantity - 1;
          }
        }
      }
    }
  }

  public extractShoppingList() {

    // make necessary function call to open the add product modal

  }

}
