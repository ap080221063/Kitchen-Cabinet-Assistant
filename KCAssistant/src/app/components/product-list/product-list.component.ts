import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductComponent } from '../product/product.component';
import { Category } from '../../classes/productCategory';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  componentProductList: Product[];
  removeProductBtnVisible: boolean;
  bsModalRef: BsModalRef;

  constructor(private prodService: ProductService,
              private modalService: BsModalService) {
    this.removeProductBtnVisible = false;
  }

  ngOnInit() {
    this.componentProductList = this.prodService.getAllProducts();
  }

  public addNewProduct() {
    let product: Product;
    let category: Category;
    category = new Category();
    category.id = 0;
    category.name = '';
    product = new Product(0, '', category, 0, 0);

    const initialState = {
      componentProduct: product,
      title: 'Add a new product',
    };

    this.bsModalRef = this.modalService.show(ProductComponent, {initialState});

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

  public productDetails(prodId: number): void {
    // this.onSelect(hero);
    let componentProduct: Product;
    componentProduct = this.componentProductList.find(y => y.id === prodId);

    const initialState = {
      componentProduct: componentProduct,
      title: componentProduct.name,
    };

    // let pc: ProductComponent;
    // pc = new ProductComponent(this.bsModalRef);
    // pc.componentProduct = product;
    // pc.bsModalRef = this.bsModalRef;

    // this.bsModalRef = this.modalService.show(pc);
    this.bsModalRef = this.modalService.show(ProductComponent, {initialState});
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
