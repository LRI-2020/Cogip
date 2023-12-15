import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ContactsService} from "../../../services/contacts.service";

@Component({
  selector: 'app-admin-contact-details',
  templateUrl: './admin-contact-details.component.html',
  styleUrl: './admin-contact-details.component.scss'
})
export class AdminContactDetailsComponent implements OnInit, OnDestroy {

  contact: Contact | undefined;
  isLoading = true;
  subscriptionsList: Subscription[] = [];

  constructor(private route: ActivatedRoute, private contactsService: ContactsService) {

  }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.loadData(id);

    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.loadData(id);
    }))

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadData(id: number) {
    this.subscriptionsList.push(this.contactsService.getContactById(id).subscribe(
      contactData => {
      this.isLoading = true;
      console.log('contact : ' + JSON.stringify(contactData));
      this.contact = contactData;
      this.isLoading = false;
    },
      error => {
        console.log(error);
        this.isLoading=false;
      }));
  }


}
