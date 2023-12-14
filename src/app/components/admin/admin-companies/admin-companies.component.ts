import {Component, Input} from '@angular/core';
import {CompaniesService} from "../../../services/companies.service";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {Company} from "../../../models/company.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrl: './admin-companies.component.scss'
})
export class AdminCompaniesComponent {

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private helpers: Helpers) {
  }

  @Input() lastItemsParams = {count: -1, prop: ''};
  @Input() dataFilter = {prop: '', value: ''};
  @Input() pagination = true;

  fetchedData: Company[] = [];
  dataToDisplay: Company[] = [];
  onlyLastItems = false;

  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  isLoading = false;

  subscriptionsList: Subscription[] = [];

  ngOnInit(): void {

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
    this.subscriptionsList.push(
      this.companiesService.fetchCompanies().subscribe((companiesData: Company[]) => {
        this.isLoading = true;

        this.fetchedData = companiesData;
        this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Company[];

        this.isLoading = false;

      }));
  }

}
