import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";
import {Subscription} from "rxjs";

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


  constructor(private contactsService:ContactsService) {
  }

  ngOnInit(): void {
   this.contactsSub = this.contactsService.fetchContacts().subscribe(contactsData => this.contacts = contactsData)
  }

  ngOnDestroy(): void {
    this.contactsSub.unsubscribe();
  }


}
