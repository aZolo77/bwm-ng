import { Input, Output, EventEmitter, OnChanges } from '@angular/core';

export class EditableComponent implements OnChanges {
  // Rental or Booking
  @Input()
  entity: any;
  // input for classes
  @Input()
  className: string;
  // стили
  @Input()
  style: any;
  // some data from component-inputs
  @Input()
  set field(entityField: string) {
    this.entityField = entityField;
    this.setOriginValue();
  }

  // value for local saving of origin value
  public originEntityValue: any;
  public entityField: string;

  // output for updated Rental or Booking
  @Output()
  entityUpdated = new EventEmitter();

  isActiveInput: boolean = false;

  constructor() {}

  ngOnChanges() {
    this.setOriginValue();
    this.isActiveInput = false;
  }

  updateEntity() {
    const entityValue = this.entity[this.entityField];
    // if value stayed the same - it will not be updated
    if (entityValue !== this.originEntityValue) {
      // emmiting updated value of entity
      this.entityUpdated.emit({
        [this.entityField]: this.entity[this.entityField]
      });
      this.setOriginValue();
    }

    this.isActiveInput = false;
  }

  setOriginValue() {
    this.originEntityValue = this.entity[this.entityField];
  }

  cancelUpdate() {
    this.isActiveInput = false;
    this.entity[this.entityField] = this.originEntityValue;
  }
}
