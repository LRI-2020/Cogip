import {Component, Input} from '@angular/core';
import {CompaniesService} from "../../../services/companies.service";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {Company, CompanyType} from "../../../models/company.model";
import {concatMap, of, Subscription, tap} from "rxjs";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-admin-companies-list',
  templateUrl: './admin-companies-list.component.html',
  styleUrl: './admin-companies-list.component.scss'
})
export class AdminCompaniesListComponent {
  protected readonly CompanyType = CompanyType;

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private helpers: Helpers,
              private notificationsService: NotificationsService) {
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
    this.subscriptionsList.push(this.displayData().subscribe());

    //Listen url for pagination pipe
    if (this.pagination)
      this.listenRoute();
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  searchData(event: Event) {
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'tva', 'country', 'type', 'createdAt']);
  }

  private displayData() {
    this.isLoading = true;
    return this.companiesService.fetchCompanies().pipe(tap({
      next : companiesData => {
      this.fetchedData = companiesData;
      this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Company[];
      this.isLoading = false;
    },
    error: ()=>{
      this.isLoading = false;
      this.notificationsService.error('Oh Oh 😕', "The company could not been loaded : ");
    }}))

  }

  onDelete(id: string) {
    try {
      this.subscriptionsList.push(this.companiesService.deleteCompany(id).pipe(concatMap(response => {
        if (response.ok)
          return this.displayData();
        return of(response);
      })).subscribe({
        next: () => {
          this.notificationsService.success('Success', "The company has been deleted");
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The company has not been deleted : ");
        }
      }))
    } catch (e) {
      let error = (e instanceof Error) ? e.message : 'An error occured.'
      this.notificationsService.error('Oh Oh 😕', error + "The company has not been deleted : ");
    }

  }

  private listenRoute() {
    this.subscriptionsList.push(
      this.route.queryParams.subscribe(params => {
        {
          this.helpers.listenPagination(params, this.paginationInfos);
        }
      }));
  }

}
