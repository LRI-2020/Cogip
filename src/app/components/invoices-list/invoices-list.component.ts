import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoicesService} from "../../services/invoices.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Helpers} from "../../shared/helpers";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss'
})
@Injectable()
export class InvoicesListComponent implements OnInit, OnDestroy {

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
              private router: Router,
              private helpers: Helpers) {
  }

  ngOnInit(): void {

    //load Data
    this.loadData();

    //Listen for pagination
    this.subscriptionsList.push(this.route.queryParams.subscribe(params => {

        this.paginationInfos = this.helpers.SetPagination(params, this.paginationInfos.itemsPerPage, this.paginationInfos.currentPage);

        //keep query params is page is reload without init
        if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
          this.router.navigate([], {queryParams: {'currentPage': this.paginationInfos.currentPage.toString(), 'itemsPerPage': this.paginationInfos.itemsPerPage}})
        }
      }
    ));
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
