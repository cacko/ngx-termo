import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TempComponent } from '../temp/temp.component';
import { LivetempComponent } from '../livetemp/livetemp.component';
import { SensorLocation } from '../../entity/location.emtity';
import { BackgroundComponent } from '../background/background.component';
import { SecondaryComponent } from '../secondary/secondary.component';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [
    CommonModule,
    TempComponent,
    LivetempComponent,
    BackgroundComponent,
    SecondaryComponent
  ],
  templateUrl: './now.component.html',
  styleUrl: './now.component.scss'
})
export class NowComponent {

  primary: SensorLocation = SensorLocation.INDOOR;
  secondary: SensorLocation = SensorLocation.OUTDOOR;

  onSecondary(event: MouseEvent) {
    event.stopPropagation();
    this.primary = this.primary == SensorLocation.INDOOR ? SensorLocation.OUTDOOR : SensorLocation.INDOOR;
    this.secondary = this.secondary == SensorLocation.INDOOR ? SensorLocation.OUTDOOR : SensorLocation.INDOOR;

  }

}
