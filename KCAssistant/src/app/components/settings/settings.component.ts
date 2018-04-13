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
    this.categoryService.createUpdateCategory(this.newCategory);
  }

  public removeCategory(categoryId: number) {
    this.categoryService.removeCategory(categoryId);
  }

  public categoryChangeState(categoryId: number) {
    this.categoryList.forEach(element => {
      if (element.id === categoryId) {
        element.active = !element.active;
        this.categoryService.createUpdateCategory(element);
      }
    });
  }

  public addEmail() {
    this.emailService.createUpdateEmail(this.newEmail);
  }

  public removeEmail(emailId: number) {
    this.emailService.removeEmail(emailId);
  }

  public emailPropertyChangeState(prop: string, emailId: number) {
    switch (prop) {
      case 'active':
        this.emailList.forEach(element => {
          if (element.id === emailId) {
            element.active = !element.active;
            this.emailService.createUpdateEmail(element);
          }
        });
      break;
      case 'issender':
        this.emailList.forEach(element => {
          if (element.id === emailId) {
            element.issender = !element.issender;
            this.emailService.createUpdateEmail(element);
          }
        });
      break;
      case 'isreceiver':
        this.emailList.forEach(element => {
          if (element.id === emailId) {
            element.isreceiver = !element.isreceiver;
            this.emailService.createUpdateEmail(element);
          }
        });
      break;
    }
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
