import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'pagination'
})
export class PaginationPipe implements PipeTransform {

  //TODO unit test on this!!!
  transform(value: any, itemsPerPage: number,currentPage: number): any {
    if (value.length === 0 || currentPage < 1 || itemsPerPage < 1) {
      return value;
    }

    let startIndex = (itemsPerPage * currentPage) - itemsPerPage;

    if (value.length - 1 < startIndex) {
      console.log('start index does not exist on value')
      return value;
    }
    let endIndex = startIndex + itemsPerPage;

    return value.slice(startIndex, endIndex);

  }

}
