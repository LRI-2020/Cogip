import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ActivatedRoute} from "@angular/router";
import {ContactsService} from "../../services/contacts.service";
import {Subscription} from "rxjs";
import {NotificationType} from "../../models/notification.model";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent implements OnInit, OnDestroy {

  contact: Contact | undefined;
  isLoading = true;
  inError = false;
  subscriptionsList: Subscription[] = [];

  constructor(private route: ActivatedRoute, private contactsService: ContactsService, private notificationsService:NotificationsService) {

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

    this.subscriptionsList.push(this.contactsService.getContactById(id).subscribe(contactData => {
        this.contact = contactData;
        this.isLoading = false;
        this.inError = false;
      },
      error => {
        this.notificationsService.notify({
          title: 'Oh Oh 😕',
          type: NotificationType.error,
          message: "The contact details could not be loaded.",
        });
        this.inError = true;
        this.isLoading = false;
      }));
  }


}
