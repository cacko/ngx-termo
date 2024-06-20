import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { NowDataModel } from '../../models/nowdata.model';
import { SensorLocation } from '../../entity/location.emtity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage
  ],
  templateUrl: './background.component.html',
})
export class BackgroundComponent implements AfterViewInit, OnChanges {

  @Input() sensor !: SensorLocation;
  imgSrc ?: string;
  dbSub?: Subscription;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private db: DatabaseService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.dbSub?.unsubscribe();
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.element.nativeElement, "sensor", this.sensor);
    this.dbSub = this.db.forSensor(this.sensor).subscribe((nowdata: NowDataModel | null) => {
      this.renderer.setStyle(this.element.nativeElement, "background-image", nowdata?.tempGradient);
      this.imgSrc = nowdata?.image;
    });
  }

}``
