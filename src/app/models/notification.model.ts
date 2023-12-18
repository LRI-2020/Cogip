export enum NotificationType {
  success = 0,
  warning = 1,
  error = 2,
  info = 3
}

export interface INotification {
  id: number,
  title: string;
  message: string;
  type: NotificationType;
  timeout: number;

}

export class Notification implements INotification{
  constructor(
    public id: number,
    public type: NotificationType,
    public title: string,
    public message: string,
    public timeout: number,
  ) {
  }

}
