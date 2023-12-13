import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any[], prop: string, propValue: any): any {

    if (prop === '' || propValue === '')
      return values;

    return values.filter(value =>  value[prop] === propValue);
  }
}
