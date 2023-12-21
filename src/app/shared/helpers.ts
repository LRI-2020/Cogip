import {ActivatedRoute, Params, Router, UrlSegment} from "@angular/router";
import {FilterPipe} from "../pipes/filter.pipe";
import {LastPipe} from "../pipes/last.pipe";
import {Injectable} from "@angular/core";
import {SearchPipe} from "../pipes/search.pipe";

export function datesEquals(date1:Date,date2:Date){
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
}


export function onWelcomePage(url: UrlSegment[]) {
  return url.length === 0;
}

export function   sortByDesc(prop: string) {
  return function (a: any, b: any) {

    if (typeof a[prop] == 'string' && typeof a[prop] !== 'number' && !(Object.prototype.toString.call(a[prop]) === "[object String]")) {
      return 0;
    }

    if (a[prop] > b[prop])
      return -1;

    if (a[prop] < b[prop])
      return 1;

    return 0;
  };

}

export function   sortByAsc(prop: string) {
  return function (a: any, b: any) {

    if (typeof a[prop] == 'string' && typeof a[prop] !== 'number' && !(Object.prototype.toString.call(a[prop]) === "[object String]")) {
      return 0;
    }

    if (a[prop] > b[prop])
      return 1;

    if (a[prop] < b[prop])
      return -1;

    return 0;
  };
}



@Injectable()
export class Helpers {

  constructor(private filterPipe: FilterPipe, private lastPipe: LastPipe, private searchPipe:SearchPipe, private router:Router) {
  }

  listenPagination(params:Params, paginationInfos: { itemsPerPage: number, currentPage: number }){

    paginationInfos.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : paginationInfos.itemsPerPage;
    paginationInfos.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : paginationInfos.currentPage;

    if ((!params['itemsPerPage'] || !params['itemsPerPage'])) {
      this.router.navigate([], {queryParams: {'currentPage': paginationInfos.currentPage.toString(), 'itemsPerPage': paginationInfos.itemsPerPage}})
    }
    return paginationInfos;

  }

  searchData(data:any[],value:string,props:string[]) {
    return this.searchPipe.transform(data,value,props);
  }

  SetPagination(params: Params, itemsPerPage: number, currentPage: number) {
    itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : itemsPerPage;
    currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : currentPage;
    return {itemsPerPage, currentPage}
  }

  filterData(data: any[], filterProp: string, filterValue: any, lastItems: { count: number, prop: string }) {
    let result: any[] = [];
    result.push(...(this.filterPipe.transform(data, filterProp, filterValue)));
    if (lastItems.count>0 && lastItems.prop!=='') {
      result = this.lastPipe.transform(result, lastItems.count, lastItems.prop);
    }
    return result;
  }
}

