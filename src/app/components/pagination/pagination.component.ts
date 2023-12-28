import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalItems: number = 0;
  itemsPerPage: number = 5;
  pagesCount: number = 1;
  currentPage: number = 1;

  constructor(private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setTotalPages();

    // reset current page to 1 if data to displayed has changed)
    if (changes['totalItems']){
      this.currentPage = 1;
      this.setPaginationParams();
      this.setTotalPages();
    }

  }

  ngOnInit() {
    this.setPaginationParams();
    this.setTotalPages();
  }

  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage = --this.currentPage;
      this.setPaginationParams();
    }
  }

  onNext() {
    if (this.currentPage < this.pagesCount) {
      this.currentPage = ++this.currentPage;
      this.setPaginationParams();
    }
  }

  onGoTo(number: number) {
    this.currentPage = number;
    this.setPaginationParams();
  }

  onItemPerPageChanges() {
    this.currentPage = 1;
    this.setPaginationParams();
    this.setTotalPages();
  }

  private setTotalPages() {
    this.pagesCount = this.itemsPerPage > 0 ?
      this.computeTotalPages()
      : 1;
  }

  private computeTotalPages(){
    return (Math.ceil(this.totalItems / this.itemsPerPage) > 0 ? Math.ceil(this.totalItems / this.itemsPerPage) : 1)
  }

  private setPaginationParams() {
    this.router.navigate([], {queryParams: {'currentPage': this.currentPage.toString(), 'itemsPerPage': this.itemsPerPage}})
  }
}
