import { Pipe, PipeTransform } from '@angular/core';
import { pipe } from 'rxjs';

@Pipe({
  name: 'upper'
})
export class UppercasePipe implements PipeTransform {
  transform(val: string): string {
    const transformedVal = val.toUpperCase();

    return transformedVal;
  }
}
