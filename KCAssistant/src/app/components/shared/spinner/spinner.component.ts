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
  @Output() qtychanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  public add() {
    this.numb = this.numb + 1;
    this.qtychanged.emit(this.numb);
  }

  public subtract() {
    if (this.numb > 0) {
      this.numb = this.numb - 1;
    }
  }

}
