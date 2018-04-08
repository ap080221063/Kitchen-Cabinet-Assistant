import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../../classes/product';
import { Category } from '../../classes/productCategory';
import { Translation } from '../../classes/translation';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { CategoryService } from '../../services/category.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;

  productSubscription: Subscription;
  product: Product;

  categoryListSubscription: Subscription;
  categoryList: Category[];

  bsModalRef: BsModalRef;
  id: number;
  isnew: boolean;

  constructor(inbsmodalref: BsModalRef,
              public categoryService: CategoryService,
              public productService: ProductService) {

    this.categoryListSubscription = this.categoryService.categoryList
    .subscribe(categories => {this.categoryList = categories; });

    this.bsModalRef = inbsmodalref;
   }

  ngOnInit() {

    this.categoryService.getAllCategories();

    if (!this.isnew) {
    this.productSubscription = this.productService.product
        .subscribe(product => {this.product = product; });
    } else {
      this.product = new Product(0, '', new Category(), 0, 0);
      this.product.category.id = 1;
      // this.product.category.name = 'Cat1';
      this.product.imgUrl = '';
    }
  }

  ngOnDestroy() {
  // unsubscribe to ensure no memory leaks
     this.categoryListSubscription.unsubscribe();
   }

  public save() {
    this.productService.createUpdateProduct(this.product);
    this.bsModalRef.hide();
  }

  public delete() {
    this.productService.removeProduct(this.product.id);
    this.bsModalRef.hide();
  }

  // public getcategoryList(): Category[] {
  //   return this.categoryService.getAllCategories();
  // }

  spinnerchanged(input: any) {
    if (input.other === 'quantity') {
      this.product.quantity = input.numb;
    } else {
      this.product.shortageQtyWarning = input.numb;
    }
  }

  categorySelectChanged(input: any) {
    this.product.category.id = input;
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.product.imgUrl = {'filename': file.name, 'filetype': file.type, 'value': reader.result.split(',')[1] };
      };
    }
  }

}
