import {UrlSegment} from "@angular/router";

export function onWelcomePage(url: UrlSegment[]){
  return url.length === 0;
}
