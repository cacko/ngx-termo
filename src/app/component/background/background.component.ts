import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { NowDataModel } from '../../models/nowdata.model';

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

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private db: DatabaseService
  ) {

  }

ngAfterViewInit(): void {
    this.db.$indoor.subscribe((nowdata: NowDataModel|null) => {
      this.renderer.setStyle(this.element.nativeElement, "background-image", `linear-gradient(#f17a65 ${nowdata?.tempGradient}, #3dcadf)`)
    });
}

}
