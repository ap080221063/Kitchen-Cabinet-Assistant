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

}
