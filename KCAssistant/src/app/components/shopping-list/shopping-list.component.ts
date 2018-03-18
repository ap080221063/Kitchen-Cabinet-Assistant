import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  neededProductList: Product[];
  bsModalRef: BsModalRef;

  constructor(inbsmodalref: BsModalRef,
      private prodService: ProductService) {
    this.bsModalRef = inbsmodalref;
   }

  ngOnInit() {
  }

  confirmShoppingListBuy(): void {

    for (let p of this.neededProductList) {
      this.prodService.addProduct(p);
    }

    this.bsModalRef.hide();
  }

  qtychanged(input: any) {
    for (let p of this.neededProductList) {
      if (p.id === input.other) {
        p.predictToBuy = input.numb;
      }
    }
  }

}
