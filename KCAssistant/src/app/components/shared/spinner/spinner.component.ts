import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() numb: number;
  @Input() label: string;
  @Input() inputdisabled: boolean;
  @Input() other: string;
  @Output() qtychanged = new EventEmitter<any>(); // EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  public add() {
    let n: number = this.numb;
    let o: string = this.other;
    n = n + 1;
    this.qtychanged.emit({'numb': n, 'other': o});
  }

  public subtract() {
    if (this.numb > 0) {
      let n: number = this.numb;
      let o: string = this.other;
      n = n - 1;
      this.qtychanged.emit({'numb': n, 'other': o});
    }
  }

}
