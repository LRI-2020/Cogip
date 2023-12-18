import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {Subscription} from "rxjs";
import {ContactsService} from "../../../services/contacts.service";
import {ActivatedRoute} from "@angular/router";
import {Helpers} from "../../../shared/helpers";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-admin-contacts',
  templateUrl: './admin-contacts.component.html',
  styleUrl: './admin-contacts.component.scss'
})
export class AdminContactsComponent implements OnInit, OnDestroy {

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
              private route: ActivatedRoute,
              private helpers: Helpers,
              private notificationsService:NotificationsService) {
  }

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

  searchData(event: Event) {
    console.log('search triggered!');
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'phone', 'email', 'company', 'createdAt']);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadData() {
    this.isLoading = true;
    this.subscriptionsList.push(this.contactsService.fetchContacts().subscribe({
      next: contactsData => {
        this.fetchedData = contactsData;
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

  onNewContact() {

  }
}
