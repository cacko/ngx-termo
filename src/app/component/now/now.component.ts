import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TempComponent } from '../temp/temp.component';
import { LivetempComponent } from '../livetemp/livetemp.component';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [
    CommonModule,
    TempComponent,
    LivetempComponent
  ],
  templateUrl: './now.component.html',
  styleUrl: './now.component.scss'
})
export class NowComponent {

}
