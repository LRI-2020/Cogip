import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Helpers} from "../../shared/helpers";


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
  inError=false;
  fetchedData: Contact[] = [];
  dataToDisplay: Contact[] = [];

  subscriptionsList: Subscription[] = [];

  constructor(private contactsService: ContactsService,
              private route: ActivatedRoute,
              private helpers: Helpers) {
  }

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
    this.subscriptionsList.push(this.contactsService.fetchContacts().subscribe(contactsData => {
      this.isLoading = true;

      this.fetchedData = contactsData;
      this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
      this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Contact[];

      this.isLoading = false;
    },

      error => {
        console.log(error);
        this.isLoading = false;

      }));
  }

}
