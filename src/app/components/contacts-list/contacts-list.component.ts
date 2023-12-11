import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {onWelcomePage} from "../../shared/helpers";

@Injectable()
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent implements OnInit, OnDestroy {

  searchFilter:string='';
  contacts:Contact[]=[];
  contactsSub:Subscription = new Subscription();
  isWelcomePage = false;
  welcomePgCheckSub = new Subscription();

  constructor(private contactsService:ContactsService, private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isWelcomePage = onWelcomePage(this.route.snapshot.url);
    this.welcomePgCheckSub = this.route.url.subscribe(urlSegments => {
      this.isWelcomePage = onWelcomePage(urlSegments);
    })
   this.contactsSub = this.contactsService.fetchContacts().subscribe(contactsData => this.contacts = contactsData)
  }

  ngOnDestroy(): void {
    this.contactsSub.unsubscribe();
    this.welcomePgCheckSub.unsubscribe();
  }

 }
