import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {catchError, concatMap, of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactsService} from "../../../services/contacts.service";
import {NotificationsService} from "../../../services/notifications.service";

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

  constructor(private route: ActivatedRoute,
              private router:Router,
              private contactsService: ContactsService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.displayData();

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadData() {
      return this.route.params.pipe(
        concatMap(params=>{
       return this.contactsService.getContactById(params['id'])
      }))
  }

  displayData(){
    this.isLoading = true;
    this.subscriptionsList.push(
      this.loadData().subscribe({
          next:contactData => {
            this.inError = false;
            this.contact = contactData;
            this.isLoading = false;
          },
          error:() => {
            this.inError = true;
            this.isLoading = false;
            this.notificationsService.error('Oh Oh 😕', "The contact details could not be loaded");
            this.router.navigate(['/admin/contacts'])

          }}));
  }


}
