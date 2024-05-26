import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TempComponent } from '../temp/temp.component';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [
    CommonModule,
    TempComponent
  ],
  templateUrl: './now.component.html',
  styleUrl: './now.component.scss'
})
export class NowComponent {

}
