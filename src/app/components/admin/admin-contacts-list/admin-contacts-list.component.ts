import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {catchError, map, mergeAll, mergeMap, of, Subscription, tap, toArray} from "rxjs";
import {ContactsService} from "../../../services/contacts.service";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {NotificationsService} from "../../../services/notifications.service";
import {CompaniesService} from "../../../services/companies.service";

@Component({
  selector: 'app-admin-contacts-list',
  templateUrl: './admin-contacts-list.component.html',
  styleUrl: './admin-contacts-list.component.scss'
})
export class AdminContactsListComponent implements OnInit, OnDestroy {

  @Input() dataFilter: { prop: string, value: any } = {prop: '', value: ''};

  onlyLastItems = false;
  @Input() lastItemsParams = {count: -1, prop: ''};

  @Input() pagination = true;
  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  isLoading = true;
  inError = false;
  fetchedData: Contact[] = [];
  dataToDisplay: Contact[] = [];

  subscriptionsList: Subscription[] = [];

  constructor(private contactsService: ContactsService,
              private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private helpers: Helpers,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {

    this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');

    //load data, displayed data and listen for changes
    this.loadData();

//Listen url for pagination pipe
    if (this.pagination) {

      this.listenParams()

    }

  }

  searchData(event: Event) {
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'phone', 'email', 'company', 'createdAt']);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadCompanyName(contact: Contact) {
    return this.companiesService.getCompanytById(contact.company).pipe(
      map(company => {
          if (company)
            contact.company_name = company.name
          this.fetchedData.push(contact);
          return contact
        }
      ),
      catchError(err => {
        this.fetchedData.push(contact);
        return of(contact)
      })
    )
  }

  loadData() {
    this.isLoading = true;
    this.subscriptionsList.push(this.contactsService.fetchContacts().pipe(
      mergeAll(),
      mergeMap(contact => {
        return this.loadCompanyName(contact)
      })
    ).subscribe({
      next: () => {
        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Contact[];
        this.isLoading = false;
        this.inError = false;
      },
      error: () => {
        this.notificationsService.error('Oh Oh 😕', "The contacts could not be loaded");
        this.isLoading = false;
        this.inError = true;
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
