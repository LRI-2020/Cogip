import { Component } from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ActivatedRoute} from "@angular/router";
import {ContactsService} from "../../services/contacts.service";

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {
contact: Contact | undefined;
constructor(private route:ActivatedRoute, private contactsService:ContactsService) {
  let id = +this.route.snapshot.params['id'];
  this.contactsService.getContactById(id).subscribe(contactData => this.contact = contactData);

}

}
