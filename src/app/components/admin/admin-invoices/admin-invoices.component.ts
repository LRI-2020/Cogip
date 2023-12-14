import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../../models/invoice.model";
import {Subscription} from "rxjs";
import {InvoicesService} from "../../../services/invoices.service";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../../shared/helpers";

@Component({
  selector: 'app-admin-invoices',
  templateUrl: './admin-invoices.component.html',
  styleUrl: './admin-invoices.component.scss'
})
export class AdminInvoicesComponent implements OnInit, OnDestroy {

  onlyLastItems = false;
  @Input() lastItemsParams = {count: -1, prop: ''};
  @Input() pagination = true;
  @Input() dataFilter: { prop: string, value: any } = {prop: '', value: ''};

  fetchedData: Invoice[] = []
  dataToDisplay: Invoice[] = []

  subscriptionsList:Subscription[]=[];
  isLoading=false;

  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  constructor(private invoicesService: InvoicesService,
              private route: ActivatedRoute,
              private helpers: Helpers) {
  }

  ngOnInit(): void {

    //load Data
    this.loadData();

    //Listen url for pagination pipe
    if (this.pagination) {
      this.subscriptionsList.push(
        this.route.queryParams.subscribe(params => {
          {
            this.helpers.listenPagination(params, this.paginationInfos);
          }
        }));
    }

  }

  searchData(event: Event) {
    console.log('search triggered!');
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['invoiceNumber', 'dueDate', 'company', 'createdAt']);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  private loadData() {
    this.subscriptionsList.push(
      this.invoicesService.fetchInvoices().subscribe(invoicesData => {
        this.isLoading=true;
        this.fetchedData = invoicesData;
        this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Invoice[];
        this.isLoading=false;

      }));
  }
}
