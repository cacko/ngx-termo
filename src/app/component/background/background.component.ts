import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { NowDataModel } from '../../models/nowdata.model';
import { SensorLocation } from '../../entity/location.emtity';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent implements AfterViewInit {

  @Input() sensor !: SensorLocation;
  imageSrc: string = "";

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private db: DatabaseService
  ) {

  }

  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.element.nativeElement, "sensor", this.sensor);
    this.db.forSensor(this.sensor).subscribe((nowdata: NowDataModel | null) => {
      // this.renderer.setStyle(this.element.nativeElement, "background-image", `url(${nowdata?.image}), linear-gradient(#f17a65 ${nowdata?.tempGradient}, #3dcadf)`);
      this.renderer.setStyle(this.element.nativeElement, "background-image", `linear-gradient(#f17a65 ${nowdata?.tempGradient}, #3dcadf)`);
    });
  }

}
