import {Component, Injectable, Input, OnDestroy, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {onWelcomePage} from "../../shared/helpers";
import {SearchPipe} from "../../pipes/search.pipe";
import {PaginationPipe} from "../../pipes/pagination.pipe";

@Injectable()
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'})
export class ContactsListComponent implements OnInit, OnDestroy {


  fetchedContacts: Contact[] = [];
  contactsToDisplay: Contact[] = [];
  onlyLastItems = false;

  searchFilter: string = '';

  itemsPerPage = 2;
  currentPage = 1;

  welcomePgCheckSub = new Subscription();
  contactsSub: Subscription = new Subscription();
  routeSub = new Subscription();

  constructor(private contactsService: ContactsService, private route: ActivatedRoute, private searchPipe: SearchPipe, private router: Router) {
  }

  ngOnInit(): void {

    //Check if on welcome page - then display only 5 last items
    this.onlyLastItems = onWelcomePage(this.route.snapshot.url);
    this.welcomePgCheckSub = this.route.url.subscribe(urlSegments => {
      this.onlyLastItems = onWelcomePage(urlSegments);
    })

    //load data, displayed data and listen for changes
    this.contactsSub = this.contactsService.fetchContacts().subscribe(contactsData => {
      this.fetchedContacts = contactsData;
      this.contactsToDisplay = contactsData;
    });

    //Listen url for pagination pipe
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : this.itemsPerPage;
      this.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : this.currentPage;

      //keep query params is page is reload without init
      if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
        this.router.navigate([], {queryParams: {'currentPage': this.currentPage.toString(), 'itemsPerPage': this.itemsPerPage}})
      }
    })

  }


  ngOnDestroy(): void {
    this.contactsSub.unsubscribe();
    this.welcomePgCheckSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  onFilterChanges(event: Event) {
    this.contactsToDisplay = new Array(...this.searchPipe.transform(this.fetchedContacts, (<HTMLInputElement>event.target).value, ['name', 'phone', 'email', 'company', 'createdAt']))
  }

}
