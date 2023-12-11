import {Pipe, PipeTransform} from '@angular/core';

function sortByDesc(prop:string) {
  return function (a: any, b: any) {

    if(typeof a[prop] == 'string' && typeof a[prop] !== 'number' && !(Object.prototype.toString.call(a[prop]) === "[object String]") ){
      return 0;
    }

    if(a[prop] > b[prop])
      return -1;

    if(a[prop]<b[prop])
      return 1;

     return 0;
  };
}

@Pipe({
  name: 'last'
})
export class LastPipe implements PipeTransform {

  transform(value: any[], count: number, prop: string): any {
    if (value.length === 0 || count < 1 || prop.trim() === '') {
      return value;
    }
    return value.sort(sortByDesc(prop)).slice(0,count);
  }
}
