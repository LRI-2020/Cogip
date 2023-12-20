import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../../models/invoice.model";
import {Subscription} from "rxjs";
import {InvoicesService} from "../../../services/invoices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {NotificationsService} from "../../../services/notifications.service";

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
              private notificationsService: NotificationsService) {
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
      ['invoiceNumber', 'dueDate', 'company', 'createdAt']);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  private loadData() {
    this.isLoading = true;
    this.subscriptionsList.push(
      this.invoicesService.fetchInvoices().subscribe({
        next:invoicesData => {
          this.fetchedData = invoicesData;
          this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Invoice[];
          this.isLoading = false;
          this.inError=false;
        },
        error:() => {
          this.inError=true;
          this.notificationsService.error('Oh Oh 😕', "The invoices could not be loaded");
          this.isLoading = false;

        }}));
  }

  onDelete(id: number) {
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
      if (e instanceof Error){
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted : "+e.message);
      }

      else {
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
      }
    }
  }
}
