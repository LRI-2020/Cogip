import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-admin-list-header',
  templateUrl: './admin-list-header.component.html',
  styleUrl: './admin-list-header.component.scss'
})
export class AdminListHeaderComponent {
  @Input()title:string='';
  @Output() onFilter = new Subject<Event>();

  onFilterChanges($event:Event){
    this.onFilter.next($event);
  }
}
