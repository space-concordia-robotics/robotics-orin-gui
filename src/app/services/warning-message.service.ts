import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarningMessageService {
  private warningMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private warningVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  getWarningMessage(): Observable<string> {
    return this.warningMessage.asObservable();
  }

  getWarningVisibility(): Observable<boolean> {
    return this.warningVisibility.asObservable();
  }

  setWarningMessage(message : string) {
    this.warningMessage.next(message);
  }

  setWarningVisibility(visibility : boolean) {
    this.warningVisibility.next(visibility)
  }
}
