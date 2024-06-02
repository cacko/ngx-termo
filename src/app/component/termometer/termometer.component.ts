import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NowDataModel } from '../../models/nowdata.model';

@Component({
  selector: 'app-termometer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './termometer.component.html',
})
export class TermometerComponent{


  @Input() data ?: Observable<NowDataModel|null>;

}
