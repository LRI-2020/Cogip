export enum NotificationType {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export interface INotification {
  title: string;
  message: string;
  type: NotificationType;
}
