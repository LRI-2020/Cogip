import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoicesService} from "../../services/invoices.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchPipe} from "../../pipes/search.pipe";
import {Helpers} from "../../shared/helpers";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss'
})
@Injectable()
export class InvoicesListComponent implements OnInit, OnDestroy {

  @Input() onlyLastItems = false;
  @Input() pagination = true;
  @Input() dataFilter: { prop: string, value: any } = {prop: '', value: ''};

  fetchedData: Invoice[] = []
  dataToDisplay: Invoice[] = []

  invoicesSub: Subscription = new Subscription();
  routeSub: Subscription = new Subscription();

  itemsPerPage = 2;
  currentPage = 1;

  constructor(private invoicesService: InvoicesService,
              private route: ActivatedRoute,
              private router: Router,
              private helpers: Helpers) {
  }

  ngOnInit(): void {

    //load Data
    this.invoicesSub = this.invoicesService.fetchInvoices().subscribe(invoicesData => {
      this.fetchedData = invoicesData;
      this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value) as Invoice[];
    })

    //Listen url for pagination
    this.routeSub = this.route.queryParams.subscribe(params => {

        let paginationResult = this.helpers.SetPagination(params, this.itemsPerPage, this.currentPage);
        this.currentPage = paginationResult.currentPage
        this.itemsPerPage = paginationResult.itemsPerPage

        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value);

        //keep query params is page is reload without init
        if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
          this.router.navigate([], {queryParams: {'currentPage': this.currentPage.toString(), 'itemsPerPage': this.itemsPerPage}})
        }
      }
    )
  }

  searchData(event: Event) {
    console.log('search triggered!');

    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value),
      (<HTMLInputElement>event.target).value,
      ['invoiceNumber', 'dueDate', 'company', 'createdAt']);
  }

  ngOnDestroy(): void {
    this.invoicesSub.unsubscribe();
    this.routeSub.unsubscribe();
  }


  // private filterData() {
  //   this.dataToDisplay = this.filterPipe.transform(this.fetchedData, this.dataFilter.prop, this.dataFilter.value);
  //
  //   if (this.onlyLastItems) {
  //     this.dataToDisplay = this.lastPipe.transform(this.dataToDisplay, 5, 'createdAt');
  //   }
  // }
  //
  // private SetPagination(params:Params) {
  //   this.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : this.itemsPerPage;
  //   this.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : this.currentPage;
  //
  // }

  // searchData(event: Event) {
  //   this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value);
  //   this.dataToDisplay = new Array(...this.searchPipe.transform(this.dataToDisplay, (<HTMLInputElement>event.target).value, ['invoiceNumber', 'dueDate', 'company', 'createdAt']))
  //
  // }
  //
}
