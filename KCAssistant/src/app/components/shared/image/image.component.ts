import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  defaultImage = 'assets/loading.gif';
  @Input() image: string;
  offset = 100;

  constructor() { }

  ngOnInit() {
  }

}
