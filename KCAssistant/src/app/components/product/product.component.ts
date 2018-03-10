import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { Translation } from '../../classes/translation';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  componentProduct: Product;
  bsModalRef: BsModalRef;
  componentTranslations: Translation[];

  constructor(inbsmodalref: BsModalRef) {
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
  }

  public delete() {
    this.componentProduct.active = false;
  }



}
