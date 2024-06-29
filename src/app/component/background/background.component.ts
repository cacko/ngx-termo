import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, inject } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { NowDataModel } from '../../models/nowdata.model';
import { SensorLocation } from '../../entity/location.emtity';
import { Subscription } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CommonModule
  ],
  templateUrl: './background.component.html',
})
export class BackgroundComponent implements AfterViewInit, OnChanges {

  @Input() sensor !: SensorLocation;
  imgSrc?: string;
  dbSub?: Subscription;


  constructor(
    private db: DatabaseService,
    private element: ElementRef = inject(ElementRef),
    private renderer: Renderer2 = inject(Renderer2)
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
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

} ``
