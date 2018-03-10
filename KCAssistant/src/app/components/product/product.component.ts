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

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  componentProduct: Product;
  bsModalRef: BsModalRef;
  componentTranslations: Translation[];
  isNew: boolean;

  constructor(inbsmodalref: BsModalRef, public categoryService: CategoryService) {
    this.bsModalRef = inbsmodalref;
    this.isNew = this.componentProduct.id === 0;
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
  }

  public delete() {
    this.componentProduct.active = false;
  }

  public getCategoryList(): Category[] {
    return this.categoryService.getAllCategories();
  }

}
