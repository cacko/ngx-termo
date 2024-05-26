import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-temp',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  templateUrl: './temp.component.html',
  styleUrl: './temp.component.scss'
})
export class TempComponent implements OnInit {

  $nowdata = this.db.$change;

  constructor(
    private db: DatabaseService
  ) {

  }


  ngOnInit(): void {
      
  }

}
