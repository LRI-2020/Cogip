import {Pipe, PipeTransform} from '@angular/core';
import {sortByDesc} from "../shared/helpers";

@Pipe({
  name: 'last'
})
export class LastPipe implements PipeTransform {

  transform(value: any[], count: number, prop: string): any {
    if (value.length === 0 || count < 1 || prop.trim() === '') {
      return value;
    }
   value.sort(sortByDesc(prop));
    return value.slice(0,count);
  }
}
