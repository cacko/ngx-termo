import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NowDataModel } from '../../models/nowdata.model';
import { ApiService } from '../../service/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions, ScaleChartOptions } from 'chart.js';
import moment, { Moment } from 'moment';
import { DatabaseService } from '../../service/db.service';
import { last } from 'lodash-es';
import { interval } from 'rxjs';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-livetemp',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './livetemp.component.html',
  styleUrl: './livetemp.component.scss'
})
export class LivetempComponent implements OnInit {

  public chartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        position: 'nearest'
      }
    },
    elements: {
      line: {
        tension: 0.5,
        borderWidth: 10,
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        },
        type: "timeseries",
        time: {
          unit: 'minute'
        },
      },
      y: {
        display: false,
        grid: {
          display: false
        },
        ticks: {
          callback: function (value, index, ticks) {
            return value + "°C";
          }
        }
      }
    },
  };
  public chartData: any = {
    datasets: [
      {
        data: [],
        label: 'R201'
      }
    ],
    labels: []
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private currentData !: NowDataModel;

  constructor(
    private api: ApiService,
    private db: DatabaseService
  ) {

  }


  ngOnInit(): void {
    this.api.getHistory().subscribe((models: NowDataModel[]) => {
      const data = models.map((m) => ({ y: m.temp, x: m.timestampDate }));
      this.currentData = last(models) as NowDataModel;
      this.chartData.datasets[0].data = data;
      this.chart?.update();
      interval(5000).subscribe(() => {
        this.currentData.timestamp = moment().toISOString();
        this.update();
      });
      this.db.$change.subscribe((data: any) => {
        this.currentData = data as NowDataModel;
      });
    });
  }

  private update() {
    this.chartData.datasets[0].data.shift();
    this.chartData.datasets[0].data.push({
      x: this.currentData.timestampDate,
      y: this.currentData.temp
    });
    this.chart?.update();
  }



}
