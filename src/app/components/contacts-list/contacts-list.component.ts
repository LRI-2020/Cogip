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
  styleUrl: './contacts-list.component.scss'})
export class ContactsListComponent implements OnInit, OnDestroy {

  @Input() dataFilter: { prop: string, value: any } = {prop: '', value: ''};

  onlyLastItems = false;
  @Input()lastItemsParams = {count:-1,prop:''};

  @Input()pagination=true;
  paginationInfos:{itemsPerPage:number,currentPage:number}={itemsPerPage : 2, currentPage : 1};

  fetchedData: Contact[] = [];
  dataToDisplay: Contact[] = [];

  contactsSub: Subscription = new Subscription();
  routeSub = new Subscription();

  constructor(private contactsService: ContactsService,
              private route: ActivatedRoute,
              private router: Router,
              private helpers:Helpers) {
  }

  ngOnInit(): void {


    //load data, displayed data and listen for changes
    this.contactsSub = this.contactsService.fetchContacts().subscribe(contactsData => {
      this.fetchedData = contactsData;
      this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
      this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Contact[];
    });

    //Listen url for pagination pipe
    this.routeSub = this.route.queryParams.subscribe(params => {

        this.paginationInfos = this.helpers.SetPagination(params, this.paginationInfos.itemsPerPage, this.paginationInfos.currentPage);

        //keep query params is page is reload without init
        if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
          this.router.navigate([], {queryParams: {'currentPage': this.paginationInfos.currentPage.toString(), 'itemsPerPage': this.paginationInfos.itemsPerPage}})
        }
      }
    )

  }

  searchData(event: Event) {
    console.log('search triggered!');
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'phone', 'email', 'company', 'createdAt']);
  }
  ngOnDestroy(): void {
    this.contactsSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

}
