import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ActivatedRoute} from "@angular/router";
import {ContactsService} from "../../services/contacts.service";
import {catchError, concatMap, of, Subscription, tap} from "rxjs";
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

  constructor(private route: ActivatedRoute, private contactsService: ContactsService, private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {

    this.loadData()

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadData() {

    this.subscriptionsList.push(
      this.route.params.pipe(
        concatMap(params=>{
          this.isLoading = true;
          return this.contactsService.getContactById(+params['id'])
            .pipe(
              tap(contactData => {
                this.contact = contactData;
                return of(contactData)
              }))
        }))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.inError = false;
          },
          error: () => {
            this.notificationsService.error('Oh Oh 😕', "The contact details could not be loaded");
            this.inError = true;
            this.isLoading = false;
          }
        }));
  }


}
