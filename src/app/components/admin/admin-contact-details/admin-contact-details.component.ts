import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ContactsService} from "../../../services/contacts.service";
import {NotificationsService} from "../../../services/notifications.service";
import {NotificationType} from "../../../models/notification.model";

@Component({
  selector: 'app-admin-contact-details',
  templateUrl: './admin-contact-details.component.html',
  styleUrl: './admin-contact-details.component.scss'
})
export class AdminContactDetailsComponent implements OnInit, OnDestroy {

  contact: Contact | undefined;
  isLoading = true;
  inError = false;
  subscriptionsList: Subscription[] = [];

  constructor(private route: ActivatedRoute, private contactsService: ContactsService, private notificationsService: NotificationsService) {

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
    this.isLoading = true;
    this.subscriptionsList.push(this.contactsService.getContactById(id).subscribe({
      next:contactData => {
        this.inError = false;
        this.contact = contactData;
        this.isLoading = false;
      },
      error:error => {
        this.inError = true;
        this.notificationsService.notify({
          title: 'Oh Oh 😕',
          type: NotificationType.error,
          message: "The contacts details could not be loaded",
        });
        this.isLoading = false;

      }}));
  }


}
