import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  neededProductListSubscription: Subscription;
  neededProductList: Product[];
  bsModalRef: BsModalRef;
  confirmBuy: boolean;
  confirmSend: boolean;

  constructor(inbsmodalref: BsModalRef, private prodService: ProductService) {
        this.bsModalRef = inbsmodalref;
        this.confirmBuy = false;
        this.confirmSend = false;
    }

  ngOnInit() {
    this.neededProductList = [];
    this.neededProductListSubscription = this.prodService.neededProductsList
        .subscribe(products => {this.neededProductList = products; });
  }

  getConfirmationShoppingListBuy(invar: boolean): void {
    this.confirmBuy = invar;
  }

  confirmShoppingListBuy(): void {
    this.prodService.productBulkAdd(this.neededProductList);
    this.bsModalRef.hide();
  }

  getConfirmationSendShoppingListEmail(invar: boolean): void {
    this.confirmSend = invar;
  }

  sendShoppingListEmail(): void {
    this.prodService.sendShoppingListEmail(this.neededProductList);
    this.confirmSend = false;
  }

  spinnerchanged(input: any) {

    this.neededProductList.forEach(element => {
      if (input.other.id === element.id && input.other.prop === 'predictToBuy' ) {
        element.predictToBuy = input.numb;
      }
    });
  }

}
