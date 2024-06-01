import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MomentModule } from 'ngx-moment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SensorLocation } from '../../entity/location.emtity';
import { Observable, Subscription } from 'rxjs';
import { NowDataModel } from '../../models/nowdata.model';
import { BackgroundComponent } from '../background/background.component';
import { TermometerComponent } from '../termometer/termometer.component';

@Component({
  selector: 'app-temp',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MomentModule,
    MatIconModule,
    MatButtonModule,
    BackgroundComponent,
    TermometerComponent
  ],
  templateUrl: './temp.component.html',
  styleUrl: './temp.component.scss'
})
export class TempComponent implements OnInit, OnChanges {

  @Input() sensor !: SensorLocation;

  $nowdata?: Observable<NowDataModel | null>;
  subscription?: Subscription;


  constructor(
    private db: DatabaseService,
    private render: Renderer2,
    private element: ElementRef
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscription?.unsubscribe()
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.render.setAttribute(this.element.nativeElement, "sensor", this.sensor);
    this.$nowdata = this.db.forSensor(this.sensor);
  }

}
