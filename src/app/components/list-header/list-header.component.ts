import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.scss'
})
export class ListHeaderComponent{
  @Input()title:string='';
  @Output() onFilter = new Subject<Event>();

  onFilterChanges($event:Event){
    this.onFilter.next($event);
  }


}
