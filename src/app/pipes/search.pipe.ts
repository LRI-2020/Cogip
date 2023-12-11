import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, searchFilter: string): any {
    if (value.length === 0 || searchFilter === '') {
      return value;
    }
    let regex = new RegExp(searchFilter.toLowerCase());
    console.log('regex : ' + regex)
    const resultArray = new Set();
    for (const item of value) {
      for (const prop in item) {
        if (typeof item[prop] === 'string') {
          if (item[prop].toLowerCase().match(regex)) {
            console.log('regex matches');
            resultArray.add(item);
          }
        }
      }
    }
    return resultArray;
  }

}
