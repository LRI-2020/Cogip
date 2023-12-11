import {Component, Injectable, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ContactsService} from "../../services/contacts.service";

@Injectable()
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent implements OnInit {

  searchFilter:string='';
  contacts:Contact[]=[];

  constructor(private contactsService:ContactsService) {
  }

  ngOnInit(): void {
    this.contactsService.fetchContacts().subscribe(contactsData => this.contacts = contactsData)
  }


}
