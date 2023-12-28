import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";
import {catchError, concatMap, mergeAll, mergeMap, of, Subscription, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../shared/helpers";
import {NotificationsService} from "../../services/notifications.service";
import {CompaniesService} from "../../services/companies.service";


@Injectable()
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent implements OnInit, OnDestroy {

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
      this.listenParams();
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

  getContactWithCompanyName(companyId: string, contact: Contact) {
    return this.companiesService.getCompanytById(companyId).pipe(
      concatMap(company => {
        contact.company_name = company ? company.name : '';
        return of(contact)
      }),
      catchError(err => {
        return of(contact)
      })
    )
  }


  loadContacts() {
    return this.contactsService.fetchContacts().pipe(
      mergeAll(),
      mergeMap(contact => {
        return this.getContactWithCompanyName(contact.company, contact)
          .pipe(
            tap(c => {
              this.fetchedData.push(c);
            }),
            catchError(err => {
              return of(contact)
            })
          )
      })
    )
  }

  loadDataToDisplay() {
    return this.loadContacts().pipe(
      tap(res => {
        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Contact[];
      })
    )
  }

  loadData() {
    this.isLoading = true;
    this.fetchedData = [];

    this.subscriptionsList.push(this.loadDataToDisplay().subscribe({
      next: () => {
        this.inError = false;
        this.isLoading = false;
      },
      error: () => {
        this.notificationsService.error('Oh Oh 😕', "The contacts could not be loaded");
        this.inError = true;
        this.isLoading = false;
      }
    }));
  }

  private listenParams() {
    this.subscriptionsList.push(
      this.route.queryParams.subscribe(params => {
        this.helpers.listenPagination(params, this.paginationInfos);
      }));
  }
}
