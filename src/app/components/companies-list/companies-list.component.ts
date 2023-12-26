import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Company, CompanyType} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../shared/helpers";
import {NotificationsService} from "../../services/notifications.service";

@Injectable()
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit, OnDestroy {
  protected readonly CompanyType = CompanyType;

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private helpers: Helpers, private notificationsService: NotificationsService) {
  }

  @Input() lastItemsParams = {count: -1, prop: ''};
  @Input() dataFilter = {prop: '', value: ''};
  @Input() pagination = true;

  fetchedData: Company[] = [];
  dataToDisplay: Company[] = [];
  onlyLastItems = false;
  inError = false;

  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  isLoading = true;

  subscriptionsList: Subscription[] = [];


  ngOnInit(): void {

    //load data, displayed data and listen for changes
    this.loadData();

    //Listen url for pagination pipe
    if (this.pagination) {
      this.listenParams();
    }

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  searchData(event: Event) {
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'tva', 'country', 'type', 'createdAt']);
  }

  loadData() {
    this.isLoading = true;

    this.subscriptionsList.push(
      this.companiesService.fetchCompanies().subscribe({
        next: (companiesData) => {
          this.inError = false;
          this.fetchedData = companiesData;
          this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
          this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Company[];
          this.isLoading = false;
        },
        error: () => {
          this.inError = true;
          this.notificationsService.error('Oh Oh 😕', "The companies could not be loaded");
          this.isLoading = false;
        }
      }));

  }

  private listenParams() {
    this.subscriptionsList.push(
      this.route.queryParams.subscribe(params => {
        {
          this.helpers.listenPagination(params, this.paginationInfos);
        }
      }));
  }
}
