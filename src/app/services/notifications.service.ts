import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {INotification} from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifyRequest = new Subject<INotification>();

  notifyRequest$ = this.notifyRequest.asObservable();

  constructor() {}

  notify(notification: INotification) {
    this.notifyRequest.next(notification);
  }}
