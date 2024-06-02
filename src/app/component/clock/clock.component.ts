import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment-timezone';
import { Observable, interval, startWith, map } from 'rxjs';



interface Time {
  minutes: string;
  hour: string;
}


@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './clock.component.html',
})
export class ClockComponent implements OnInit {
  $time?: Observable<Time | null>;


  ngOnInit(): void {
    const time_obj = () => {
      const now = moment().utc();
      const bst = now.tz('Europe/London');
      return {
        hour: now.format('HH'),
        minutes: now.format('mm')
      };
    };
    this.$time = interval(60000)
      .pipe(
        map(() => time_obj()),
        startWith(time_obj())
      );
  }

}
