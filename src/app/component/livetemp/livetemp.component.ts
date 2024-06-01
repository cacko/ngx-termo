import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NowDataModel } from '../../models/nowdata.model';
import { ApiService } from '../../service/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, Chart, } from 'chart.js';
import moment, { Moment } from 'moment';
import { DatabaseService } from '../../service/db.service';
import { last, takeRightWhile } from 'lodash-es';
import { Subscription, interval } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Context } from 'chartjs-plugin-datalabels';


import 'chartjs-adapter-moment';
import { SensorLocation } from '../../entity/location.emtity';

const CHART_COLORS = {
  red: '#E6836B',
  orange: '#e37100',
  green: '#A0A6A5',
  blue: '#5a64ff',
  grey: '#797869',
};

Chart.register(ChartDataLabels);

let current_level: string = "";


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
export class LivetempComponent implements OnInit, OnChanges {

  @Input() sensor !: SensorLocation;
  sub ?: Subscription;
  timer ?: Subscription;

  public chartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        color: '#000',
        display: 'auto',
        align: 'start',
        clamp: true,
        offset: 5,
        rotation: -60,
        font: {
          family: "'Ubuntu Condensed'",
          size: 15
        },
        formatter: function (value, context: Context) {
          const dIdx = context.dataIndex;
          const data = context.dataset.data as Array<any>;
          const previous = data[dIdx - 1] || null;
          return previous && previous.y == value.y ? null : value.y + "°C";
        }
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
        offset: true,
        grid: {
          display: false
        },
        ticks: {
          callback: function (value, index, ticks) {
            return value + "°C";
          },
          stepSize: 0.1,
        }
      }
    },
  };
  public chartData: any = {
    datasets: [
      {
        data: [],
        label: 'R201',
        // borderColor: function (context: any) {
        //   console.log(context);
        //   const chart = context.chart;
        //   const { ctx, chartArea } = chart;

        //   if (!chartArea) {
        //     // This case happens on initial chart load
        //     return;
        //   }

        //   if (!('parsed' in context)) {
        //     return current_level;
        //   }

        //   const temp = context.parsed.y;
        //   const levels = [
        //     { min: 30, color: CHART_COLORS.orange },
        //     { min: 24, color: CHART_COLORS.red },
        //     { min: 15, color: CHART_COLORS.green },
        //     { min: 5, color: CHART_COLORS.blue },
        //     { min: -20, color: CHART_COLORS.grey }
        //   ];

        //   const f_min = takeRightWhile(levels, (l) => temp > l.min)[0];
        //   current_level = f_min.color;
        //   return current_level;
        // },
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

  ngOnChanges(changes: SimpleChanges): void {
      this.timer?.unsubscribe();
      this.sub?.unsubscribe();
      this.ngOnInit();
  }


  ngOnInit(): void {
    this.api.getHistory(this.sensor).subscribe((models: NowDataModel[]) => {
      const data = models.map((m) => ({ y: m.temp, x: m.timestampDate }));
      this.currentData = last(models) as NowDataModel;
      this.chartData.datasets[0].data = data;
      this.chart?.update();
      this.timer = interval(5000).subscribe(() => {
        this.currentData.timestamp = moment().toISOString();
        this.update();
      });
      this.sub = this.db.forSensor(this.sensor).subscribe((data: any) => {
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