import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Product } from '../../classes/product';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  neededProductList: Product[];
  bsModalRef: BsModalRef;

  constructor(inbsmodalref: BsModalRef) {
    this.bsModalRef = inbsmodalref;
   }

  ngOnInit() {
  }

}
