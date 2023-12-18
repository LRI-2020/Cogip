import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {INotification, Notification, NotificationType} from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifyRequest = new Subject<INotification>();
  notifyRequest$ = this.notifyRequest.asObservable();
  private _idx=0;

  constructor() {}

  info(title: string, message: string, timeout = 3000) {
    console.log('info added : '+ this._idx)

    this.notifyRequest.next(new Notification(this._idx++, NotificationType.info, title, message, timeout));
  }

  success(title: string, message: string, timeout = 3000) {
    console.log('success added : '+ this._idx)
    this.notifyRequest.next(new Notification(this._idx++, NotificationType.success, title, message, timeout));
  }

  warning(title: string, message: string, timeout = 3000) {
    console.log('warning added : '+ this._idx)

    this.notifyRequest.next(new Notification(this._idx++, NotificationType.warning, title, message, timeout));
  }

  error(title: string, message: string, timeout = 0) {
    console.log('error added : '+ this._idx)
    this.notifyRequest.next(new Notification(this._idx++, NotificationType.error, title, message, timeout));
  }}


