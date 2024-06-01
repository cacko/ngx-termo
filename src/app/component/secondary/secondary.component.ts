import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { TempComponent } from '../temp/temp.component';
import { DatabaseService } from '../../service/db.service';
import { Observable, Subscription } from 'rxjs';
import { NowDataModel } from '../../models/nowdata.model';
import { SensorLocation } from '../../entity/location.emtity';
import { TermometerComponent } from '../termometer/termometer.component';
import { MatIconModule } from '@angular/material/icon';
import { BackgroundComponent } from '../background/background.component';

@Component({
  selector: 'app-secondary',
  standalone: true,
  imports: [
    CommonModule,
    TermometerComponent,
    MatIconModule,
    BackgroundComponent
  ],
  templateUrl: './secondary.component.html',
  styleUrl: './secondary.component.scss'
})
export class SecondaryComponent implements OnInit, OnChanges {

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
    this.subscription?.unsubscribe();
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.render.setAttribute(this.element.nativeElement, "sensor", this.sensor);
    this.$nowdata = this.db.forSensor(this.sensor);
    this.subscription = this.db.forSensor(this.sensor).subscribe((nowdata: NowDataModel | null) => {
      this.render.setStyle(this.element.nativeElement, "background-image", `linear-gradient(#f17a65 ${nowdata?.tempGradient}, #3dcadf)`);
    });
  }

  

}
