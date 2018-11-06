import { Component, Input } from '@angular/core';
import { EditableComponent } from '../editable-component';

@Component({
  selector: 'bwm-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss']
})
export class EditableInputComponent extends EditableComponent {
  // тип для инпутов
  @Input()
  type: string = 'text';
  // инпут для функции
  @Input()
  transformView = value => value;
}
