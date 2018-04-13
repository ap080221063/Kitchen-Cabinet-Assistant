import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { config } from '../../environments/environment';
import { Email } from '../classes/email';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmailService {

  public emailList = new Subject<Email[]>();
  public Server = config.serverurl + ':' + config.serverport + '/';

  constructor(private http: HttpClient) { }

  public getAllEmails(): void {
    this.http.get<any>(this.Server + 'emaillist')
            .subscribe(data => this.emailList.next(data));

  }

  public removeEmail(emailId: number): void {
    this.http.post<any>(this.Server + 'emailremove/' + emailId, '')
            .subscribe(data => this.emailList.next(data));
  }

  public createUpdateEmail(email: Email): void {
    this.http.post<any>(this.Server + 'emailsave/' + email.id, email)
            .subscribe(data => this.emailList.next(data));
  }


}
