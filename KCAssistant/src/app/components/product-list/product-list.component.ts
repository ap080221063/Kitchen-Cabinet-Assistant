import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductComponent } from '../product/product.component';
import { Category } from '../../classes/productCategory';
import { Subscription } from 'rxjs/Subscription';
import fontawesome from '@fortawesome/fontawesome';
import faicons from '@fortawesome/fontawesome-free-regular/';
import faiconssolid from '@fortawesome/fontawesome-free-solid/';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { config } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  public Server = config.serverurl + ':' + config.serverport + '/';

  componentProductListSubscription: Subscription;
  componentProductList: Product[];

  removeProductBtnVisible: boolean;
  bsModalRef: BsModalRef;

  constructor(private prodService: ProductService,
              private modalService: BsModalService) {

    fontawesome.library.add(faicons);
    fontawesome.library.add(faiconssolid);

    this.componentProductListSubscription = this.prodService.productList
        .subscribe(products => {this.componentProductList = products; });

    this.removeProductBtnVisible = false;
  }

  ngOnInit() {
     setTimeout(() => this.getProducts());
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.componentProductListSubscription.unsubscribe();
  }

  public getProducts(): void {
    this.prodService.getActiveProducts();
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
      isnew: true,
    };

    this.bsModalRef = this.modalService.show(ProductComponent, {initialState});

  }

  public removeProductButtonVisibleToggle() {
    let aux: boolean;
    aux = !this.removeProductBtnVisible;
    this.removeProductBtnVisible = aux;
  }

  public removeProduct(prodId: number) {
    this.prodService.removeProduct(prodId);
    this.getProducts();
  }

  public productDetails(prodId: number): void {

    if (prodId !== 0) {
      this.prodService.getProduct(prodId);
    }

    const initialState = {
      id: prodId,
      isnew: false,
    };

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
        this.prodService.createUpdateProduct(iterProduct);
      }
    }
  }

  public extractShoppingList() {

    this.prodService.getNeededProducts();

    const initialState = {
      title: 'Shopping list',
    };

    this.bsModalRef = this.modalService.show(ShoppingListComponent, Object.assign({initialState}, { class: 'gray modal-lg' }));

  }

}
