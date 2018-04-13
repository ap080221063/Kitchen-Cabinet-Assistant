import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { CategoryService } from '../../services/category.service';
import { EmailService } from '../../services/email.service';
import { Category } from '../../classes/productCategory';
import { Email } from '../../classes/email';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  bsModalRef: BsModalRef;
  categoryListSubscription: Subscription;
  categoryList: Category[];

  emailListSubscription: Subscription;
  emailList: Email[];

  newCategory: Category;
  newEmail: Email;

  constructor(inbsmodalref: BsModalRef,
    public categoryService: CategoryService,
    public emailService: EmailService) {

      this.categoryList = [];
      this.categoryListSubscription = this.categoryService.categoryList
      .subscribe(categories => {this.categoryList = categories; });

      this.emailList = [];
      this.emailListSubscription = this.emailService.emailList
      .subscribe(emails => {this.emailList = emails; });

      this.bsModalRef = inbsmodalref;

      this.newCategory = this.initializeCategory();
      this.newEmail = this.initializeEmail();
    }

  ngOnInit() {
    this.categoryService.getAllCategories();
    this.emailService.getAllEmails();
  }

  ngOnDestroy() {
    this.categoryListSubscription.unsubscribe();
    this.emailListSubscription.unsubscribe();
  }

  public addCategory() {

  }

  public removeCategory(categoryId: number) {

  }

  public addEmail() {

  }

  public removeEmail(emailId: number) {

  }

  private initializeCategory(): Category {
    let auxCategory: Category;
    auxCategory = new Category();
    auxCategory.id = 0;
    auxCategory.name = '';
    auxCategory.active = true;
    return auxCategory;
  }

  private initializeEmail(): Email {
    let auxEmail: Email;
    auxEmail = new Email();
    auxEmail.id = 0;
    auxEmail.email = '';
    auxEmail.active = true;
    auxEmail.issender = false;
    auxEmail.isreceiver = true;
    return auxEmail;
  }

}
