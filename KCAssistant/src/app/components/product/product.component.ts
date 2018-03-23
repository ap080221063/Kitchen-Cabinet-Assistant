import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { Category } from '../../classes/productCategory';
import { Translation } from '../../classes/translation';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { CategoryService } from '../../services/category.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  componentProduct: Product;
  bsModalRef: BsModalRef;
  componentTranslations: Translation[];
  isnew: boolean;

  constructor(inbsmodalref: BsModalRef, public categoryService: CategoryService, public productService: ProductService) {
    this.bsModalRef = inbsmodalref;
   }

  ngOnInit() {
   // this.componentProduct = this.bsModalRef.content.product;
  }

  public save() {
    if (this.componentProduct.id = 0) {
      // save as new
    } else {
      // save existing
    }
    this.productService.getActiveProducts();
    this.bsModalRef.hide();
  }

  public delete() {
    this.componentProduct.active = false;
    this.productService.getActiveProducts();
    this.bsModalRef.hide();
  }

  public getCategoryList(): Category[] {
    return this.categoryService.getAllCategories();
  }

  qtychanged(input: any) {
    this.componentProduct.quantity = input.numb;
  }

}
