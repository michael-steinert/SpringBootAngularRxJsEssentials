import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  onDefault(message: string): void {
    this.notifier.notify(MessageType.DEFAULT, message);
  }

  onSuccess(message: string): void {
    this.notifier.notify(MessageType.SUCCESS, message);
  }

  onInfo(message: string): void {
    this.notifier.notify(MessageType.INFO, message);
  }

  onWarning(message: string): void {
    this.notifier.notify(MessageType.WARNING, message);
  }
  
  onError(message: string): void {
    this.notifier.notify(MessageType.ERROR, message);
  }
}

enum MessageType {
  DEFAULT = 'default',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}
