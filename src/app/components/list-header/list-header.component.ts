import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {onWelcomePage} from "../../shared/helpers";
import {ActivatedRoute} from "@angular/router";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.scss'
})
export class ListHeaderComponent{
  @Input()title:string='';
  @Output() onFilter = new Subject<Event>();

  constructor() {
  }

  onFilterChanges($event:Event){
    this.onFilter.next($event);
  }


}
