import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, searchFilter: string, props: string[]): any {
    if (value.length === 0 || searchFilter === '' || props.length < 1) {
      return value;
    }
    let regex = this.generateRegex(searchFilter.toLowerCase());
    console.log('regex : ' + regex);
    let resultArray = new Set();
    for (const item of value) {
      for (const prop of props) {
        switch (typeof item[prop]) {
          case 'string':
            if (this.searchOnString(item, item[prop], regex) !== undefined) {
              resultArray.add(this.searchOnString(item, item[prop], regex))
            }
            break;
          case 'number':
            if (this.searchOnString(item, item[prop].toString(), regex) !== undefined) {
              resultArray.add(this.searchOnString(item, item[prop].toString(), regex))
            }

        }

      }
    }
    return resultArray;
  }

  private searchOnString(item: any, value: string, regex: RegExp) {

    if (value.toLowerCase().match(regex)) {
      return item
    }
  }

  private generateRegex(searchFilter: string) {
    console.log('searchfilter : ' + searchFilter);
    let charactersToEscape = ['+', '.'];
    let split = searchFilter.split('');
    for (let character of split ) {
      if (charactersToEscape.indexOf(character) !== -1) {
          split[split.indexOf(character)] = "\\" + character;
      }
    }
    console.log("regex after escaping : " + split.join(''));
    return new RegExp(split.join(''));
  }
}
