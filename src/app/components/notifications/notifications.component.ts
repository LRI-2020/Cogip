import {Component, OnDestroy, OnInit} from '@angular/core';
import {INotification, NotificationType} from "../../models/notification.model";
import {NotificationsService} from "../../services/notifications.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {

//Notification object with the data that is going to be showed.
  notifications: INotification[] = [];
  notificationSubscription = new Subscription();

  constructor(private notificationService: NotificationsService) {
  }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.notifyRequest$.subscribe(notificationData => {
      this.notifications.push(notificationData);
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== notificationData.id);
      }, notificationData.timeout ? notificationData.timeout : 3000);

    })

  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }


  className(notification: INotification): string {

    let style: string;

    switch (notification.type) {

      case NotificationType.success:
        style = 'success';
        break;


      case NotificationType.warning:
        style = 'warning';
        break;

      case NotificationType.error:
        style = 'error';
        break;

      default:
        style = 'info';
        break;
    }

    return style;
  }

}
