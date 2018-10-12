import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bwm-rental-list-item',
  templateUrl: './rental-list-item.component.html',
  styleUrls: ['./rental-list-item.component.scss']
})
export class RentalListItemComponent implements OnInit {
  // to pass data from parent-component
  @Input()
  rental: any;

  constructor() {}

  ngOnInit() {}
}
