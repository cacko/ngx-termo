import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private hourSubject = new BehaviorSubject<number>(0);
  $hour = this.hourSubject.asObservable();

  constructor() { 

  }

  start() {
    this.hourSubject.next((new Date().getHours()));
    interval(30 * 60 * 1000).subscribe(() => {
      this.hourSubject.next((new Date().getHours()));
    });
  }
}
