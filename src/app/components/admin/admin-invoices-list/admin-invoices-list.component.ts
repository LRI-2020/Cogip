import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../../models/invoice.model";
import {concatMap, map, mergeMap, Subscription, toArray} from "rxjs";
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

  fetchedData: { invoice: Invoice, companyName: string }[] = []
  // dataToDisplay: Invoice[] = []
  dataToDisplay: { invoice: Invoice, companyName: string }[] = []

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
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['invoiceNumber', 'dueDate', 'company_id', 'createdAt']);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  private loadData() {

    this.invoicesService.fetchInvoices()
      .pipe(
        mergeMap(invoices => invoices),
        mergeMap(
          invoice => {
            return this.companiesService.getCompanytById(invoice.company_id).pipe(map(company => {
              return{
                invoice:invoice,
                companyName:company?company.name:''
              }
            }))
          }),
        toArray()
      )

      .subscribe({
        next: result => {
          this.fetchedData=result;
          console.log(JSON.stringify(this.fetchedData))
          this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams)
          console.log(JSON.stringify(this.dataToDisplay))

          this.isLoading=false;
        },
        error:()=>{
          this.notificationsService.error('Oh Oh 😕', "The invoices could not be loaded");
        }
  });

  }

  onDelete(id: string) {
    try {
      this.invoicesService.deleteInvoice(id).subscribe({
        next: response => {
          if (response.ok) {
            this.notificationsService.success('Success', "The invoice has been deleted");
            this.router.navigate(['/admin/invoices']);
          }
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted : " + e.message);
      } else {
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
      }
    }
  }


}
