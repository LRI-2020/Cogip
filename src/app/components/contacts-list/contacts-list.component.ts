import {Component, Injectable, Input, OnDestroy, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {onWelcomePage} from "../../shared/helpers";
import {SearchPipe} from "../../pipes/search.pipe";

@Injectable()
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
  providers:[SearchPipe]
})
export class ContactsListComponent implements OnInit, OnDestroy {

  searchFilter:string='';
  contacts:Contact[]=[];
  contactsSub:Subscription = new Subscription();
  isWelcomePage = false;
  welcomePgCheckSub = new Subscription();
  itemsPerPage=2;
  displayedContact:Contact[]=[];

  constructor(private contactsService:ContactsService, private route:ActivatedRoute, private searchPipe:SearchPipe) {
  }

  ngOnInit(): void {
    this.isWelcomePage = onWelcomePage(this.route.snapshot.url);
    this.welcomePgCheckSub = this.route.url.subscribe(urlSegments => {
      this.isWelcomePage = onWelcomePage(urlSegments);
    })
   this.contactsSub = this.contactsService.fetchContacts().subscribe(contactsData =>
   {this.contacts = contactsData;
   this.displayedContact = contactsData})
  }


  ngOnDestroy(): void {
    this.contactsSub.unsubscribe();
    this.welcomePgCheckSub.unsubscribe();
  }

  onFilterChanges(event:Event){
    this.displayedContact = new Array(...this.searchPipe.transform(this.contacts,(<HTMLInputElement> event.target).value, ['name','phone','email','company','createdAt']))
  }

 }
