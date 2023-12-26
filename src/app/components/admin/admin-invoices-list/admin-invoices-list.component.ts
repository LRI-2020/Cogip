import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../../models/invoice.model";
import {concatMap, of, Subscription, tap} from "rxjs";
import {InvoicesService} from "../../../services/invoices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {NotificationsService} from "../../../services/notifications.service";
import {CompaniesService} from "../../../services/companies.service";

@Component({
  selector: 'app-admin-list-invoices',
  templateUrl: './admin-invoices-list.component.html',
  styleUrl: './admin-invoices-list.component.scss'
})
export class AdminInvoicesListComponent implements OnInit, OnDestroy {

  onlyLastItems = false;
  @Input() lastItemsParams = {count: -1, prop: ''};
  @Input() pagination = true;
  @Input() dataFilter: { prop: string, value: any } = {prop: '', value: ''};

  fetchedData: Invoice[] = []
  dataToDisplay: Invoice[] = []

  subscriptionsList: Subscription[] = [];
  isLoading = true;
  inError = false;

  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  constructor(private invoicesService: InvoicesService,
              private route: ActivatedRoute,
              private helpers: Helpers,
              private router: Router,
              private notificationsService: NotificationsService,
              private companiesService: CompaniesService) {
  }

  ngOnInit(): void {
    this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
    console.log('company id received in list invoices component : '+this.dataFilter.value)

    //load Data
    this.subscriptionsList.push(this.loadData().subscribe());

    //Listen url for pagination pipe
    if (this.pagination)
      this.setPagination();
  }

  searchData(event: Event) {
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['invoiceNumber', 'dueDate', 'createdAt', 'company_name']);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  private loadData() {
    this.isLoading = true;
    return  this.invoicesService.getInvoicesWithCompany().pipe(tap({
      next: result => {
        this.fetchedData = result;
        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams)
        this.isLoading = false;
      },
        error: () => {
        this.isLoading=false;
        this.notificationsService.error('Oh Oh 😕', "The invoices could not be loaded");
      }
    }))
  }

  onDelete(id: string) {
    try {
      this.subscriptionsList.push(this.invoicesService.deleteInvoice(id).pipe(concatMap(response =>{
          if(response.ok)
               return this.loadData();
          return of(response)
      })).subscribe({
        next: () => {
          this.notificationsService.success('Success', "The invoice has been deleted");
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
        }
      }));
    } catch (e) {
      let error = (e instanceof Error) ? e.message : 'An error occured.'
      this.notificationsService.error('Oh Oh 😕', error + "The invoice has not been deleted : ");

    }
  }


  private setPagination() {
    this.subscriptionsList.push(
      this.route.queryParams.subscribe(params => {
        {
          this.helpers.listenPagination(params, this.paginationInfos);
        }
      }));
  }

}
