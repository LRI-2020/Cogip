import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalItems: number = 0;
  @Input() currentPage: number = 0;
  @Input() itemsPerPage: number = 0;
  pagesCount: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    this.pagesCount = this.itemsPerPage > 0?
      (Math.ceil(this.totalItems/this.itemsPerPage)>0? Math.ceil(this.totalItems/this.itemsPerPage):1)
      : 1;
  }
  ngOnInit() {
    console.log('displayedContacts : ' + this.totalItems)
    this.pagesCount = this.itemsPerPage > 0?
      (Math.ceil(this.totalItems/this.itemsPerPage)>0? Math.ceil(this.totalItems/this.itemsPerPage):1)
      : 1;  }

  counter(i: number) {
    return new Array(i);
  }


}
