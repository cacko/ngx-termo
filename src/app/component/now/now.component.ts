import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, inject } from '@angular/core';
import { TempComponent } from '../temp/temp.component';
import { LivetempComponent } from '../livetemp/livetemp.component';
import { SensorLocation } from '../../entity/location.emtity';
import { BackgroundComponent } from '../background/background.component';
import { SecondaryComponent } from '../secondary/secondary.component';
import { MomentModule } from 'ngx-moment';
import { TimeService } from '../../service/time.service';
import { LayoutModule } from '@angular/cdk/layout';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../service/loader.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [
    CommonModule,
    TempComponent,
    LivetempComponent,
    BackgroundComponent,
    SecondaryComponent,
    MomentModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    RouterModule
  ],
  templateUrl: './now.component.html',
})
export class NowComponent implements AfterViewInit, OnInit {

  primary: SensorLocation = SensorLocation.INDOOR;
  secondary: SensorLocation = SensorLocation.OUTDOOR;
  livesensors = [this.primary, this.secondary];

  
  $isLarge = this.breakpointObserver.observe([
    Breakpoints.Large
  ]).pipe((
    tap(e => {
      console.debug(e);
    }
  )));

  constructor(
    private element: ElementRef = inject(ElementRef),
    private renderer: Renderer2 = inject(Renderer2),
    private timeService: TimeService,
    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver),
    private loader: LoaderService
  ) {

  }

  onSecondary(event?: UIEvent) {
    // event?.stopPropagation();
    this.primary = this.primary == SensorLocation.INDOOR ? SensorLocation.OUTDOOR : SensorLocation.INDOOR;
    this.secondary = this.secondary == SensorLocation.INDOOR ? SensorLocation.OUTDOOR : SensorLocation.INDOOR;
  }

  ngOnInit(): void {
    this.loader.show();
  }


  ngAfterViewInit(): void {
    this.loader.hide();
    this.timeService.$hour.subscribe((hour: number) => {
      this.renderer.setAttribute(this.element.nativeElement, "hour", `${hour}`);
    });
  }

}
