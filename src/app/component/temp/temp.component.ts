import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/db.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MomentModule } from 'ngx-moment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-temp',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MomentModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './temp.component.html',
  styleUrl: './temp.component.scss'
})
export class TempComponent implements OnInit {

  $nowdata = this.db.$indoor;

  constructor(
    private db: DatabaseService
  ) {

  }


  ngOnInit(): void {
      
  }

}
