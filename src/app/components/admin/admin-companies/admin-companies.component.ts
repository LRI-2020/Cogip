import {Component, Input} from '@angular/core';
import {CompaniesService} from "../../../services/companies.service";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {Company} from "../../../models/company.model";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../../services/notifications.service";
import {NotificationType} from "../../../models/notification.model";

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrl: './admin-companies.component.scss'
})
export class AdminCompaniesComponent {

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private helpers: Helpers,
              private notificationsService:NotificationsService) {
  }

  @Input() lastItemsParams = {count: -1, prop: ''};
  @Input() dataFilter = {prop: '', value: ''};
  @Input() pagination = true;

  fetchedData: Company[] = [];
  dataToDisplay: Company[] = [];
  onlyLastItems = false;

  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  isLoading = true;
  inError = false;

  subscriptionsList: Subscription[] = [];

  ngOnInit(): void {

    this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');

    //load data, displayed data and listen for changes
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

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  searchData(event: Event) {
    console.log('search triggered!');
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'tva', 'country', 'type', 'createdAt']);
  }

  loadData() {
    this.isLoading = true;
    this.subscriptionsList.push(
      this.companiesService.fetchCompanies().subscribe({
        next:(companiesData)=>{
          this.inError = false;
          this.fetchedData = companiesData;
          this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Company[];
          this.isLoading = false;
        },
        error:(error)=>{
          this.inError = true;
          this.isLoading = false;
          this.notificationsService.notify({
            title: 'Oh Oh 😕',
            type: NotificationType.error,
            message: "The companies could not be loaded",
          });
        }
      }));
  }

}
