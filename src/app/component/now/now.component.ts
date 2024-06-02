import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { TempComponent } from '../temp/temp.component';
import { LivetempComponent } from '../livetemp/livetemp.component';
import { SensorLocation } from '../../entity/location.emtity';
import { BackgroundComponent } from '../background/background.component';
import { SecondaryComponent } from '../secondary/secondary.component';
import { MomentModule } from 'ngx-moment';
import { TimeService } from '../../service/time.service';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [
    CommonModule,
    TempComponent,
    LivetempComponent,
    BackgroundComponent,
    SecondaryComponent,
    MomentModule
  ],
  templateUrl: './now.component.html',
  styleUrl: './now.component.scss'
})
export class NowComponent implements AfterViewInit {

  primary: SensorLocation = SensorLocation.INDOOR;
  secondary: SensorLocation = SensorLocation.OUTDOOR;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private timeService: TimeService
  ) {

  }

  onSecondary(event: MouseEvent) {
    event.stopPropagation();
    this.primary = this.primary == SensorLocation.INDOOR ? SensorLocation.OUTDOOR : SensorLocation.INDOOR;
    this.secondary = this.secondary == SensorLocation.INDOOR ? SensorLocation.OUTDOOR : SensorLocation.INDOOR;

  }

  ngAfterViewInit(): void {
      this.timeService.$hour.subscribe((hour: number) => {
        this.renderer.setAttribute(this.element.nativeElement, "hour", `${hour}`);
      })
  }

}
