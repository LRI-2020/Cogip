import { Component } from '@angular/core';
import {INotification, NotificationType} from "../../models/notification.model";
import {NotificationsService} from "../../services/notifications.service";
import {debounceTime, tap} from "rxjs";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  //Flag that is going to be used in the view to determine if the notification should be visible or not.
  showNotification: boolean = false;

//Notification object with the data that is going to be showed.
  incomingNotification: INotification = {
    title: '',
    message: '',
    type: NotificationType.error,
  };

  constructor(private notificationService: NotificationsService) {}

  ngOnInit(): void {
    //We subscribe or listens to new values / notification requests.
    this.notificationService.notifyRequest$
      .pipe(
//we receive new notification and update the values of the notification object we have in this component.
// we alse make the notification visible.
        tap((notification: INotification) => {
          this.incomingNotification = notification;
          this.showNotification = true;
        }),
//we wait for 3 seconds before updating the visibility of the notification
        debounceTime(5000),
//3 seconds later, we make our notification invisible again and ready for the value.
        tap(() => {
          this.showNotification = false;
        })
      )
      .subscribe();
  }
}
