import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], searchFilter: string, props: string[]): any {
    if (value.length === 0 || searchFilter === '' || props.length < 1) {
      return value;
    }
    let regex = this.generateRegex(searchFilter.toLowerCase());
    let resultArray = new Set();
    for (const item of value) {
      for (const prop of props) {
          let res = this.search(item,prop,regex)
        if(res)
          resultArray.add(res);
      }
    }
    return Array.from(resultArray);
  }

  private searchOnString(item: any, value: string, regex: RegExp) {

    if (regex.exec(value.toLowerCase())) {
      return item
    }
  }

  private generateRegex(searchFilter: string) {
    let charactersToEscape = ['+', '.'];
    let split = searchFilter.split('');
    for (let character of split) {
      if (charactersToEscape.indexOf(character) !== -1) {
        split[split.indexOf(character)] = "\\" + character;
      }
    }
    return new RegExp(split.join(''));
  }

  private search(item:any,prop:string,regex:RegExp) {
    console.log(Object.prototype.toString.call(item[prop]))
    switch (Object.prototype.toString.call(item[prop])) {
      case '[object String]':
        return this.searchOnString(item, item[prop], regex)
      case '[object Number]':
        return this.searchOnString(item, item[prop].toString(), regex)
      case '[object Date]':
        return this.searchOnString(item, item[prop].toString(), regex)
    }
  }
}
