import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NowDataModel } from '../../models/nowdata.model';
import { ApiService } from '../../service/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, Chart, } from 'chart.js';
import moment, { Moment } from 'moment';
import { DatabaseService } from '../../service/db.service';
import { forEach, last, takeRightWhile } from 'lodash-es';
import { Subscription, interval } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Context } from 'chartjs-plugin-datalabels';


import 'chartjs-adapter-moment';
import { SensorLocation } from '../../entity/location.emtity';
import { PERIOD } from '../../entity/api.entity';

const CHART_COLORS = {
  red: '#E6836B',
  orange: '#e37100',
  green: '#A0A6A5',
  blue: '#5a64ff',
  grey: '#797869',
};

Chart.register(ChartDataLabels);

interface CurrentData {
  [key: number]: NowDataModel;
}

@Component({
  selector: 'app-livetemp',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './livetemp.component.html',
})
export class LivetempComponent implements OnInit, OnChanges {

  @Input() sensors: SensorLocation[] = [];
  sub?: Subscription;
  timer?: Subscription;

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
        color: '#fff',
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
          return value.y.toFixed(1) + "°C";
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
        min: 0,
        max: 40,
        grid: {
          display: false
        },
        ticks: {
          callback: function (value, index, ticks) {
            return Number(value).toFixed(1) + "°C";
          },
          stepSize: 0.1,
        }
      }
    },
  };
  public chartData: any = {
    datasets: [],
    labels: []
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private currentData: CurrentData = {}

  dataSets = {
    [SensorLocation.INDOOR]: 0,
    [SensorLocation.OUTDOOR]: 1
  };

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
    this.chartData.datasets = [];
    for (const sensor of this.sensors) {
      this.chartData.datasets[this.dataSets[sensor]] = {
        data: [],
        label: sensor,
        fill: true
      };
      this.api.getHistory(sensor, PERIOD.HOUR).subscribe((models: NowDataModel[]) => {
        const data = models.map((m) => ({ y: m.temp, x: m.timestampDate }));
        this.currentData[this.dataSets[sensor]] = last(models) as NowDataModel;
        this.chartData.datasets[this.dataSets[sensor]].data = data;
        Object.keys(this.currentData).length == this.sensors.length && this.update();
        this.sub = this.db.forSensor(sensor).subscribe((data: any) => {
          this.currentData[this.dataSets[sensor]] = data as NowDataModel;
        });
      });
    }

    this.timer = interval(15000).subscribe(() => {
      this.update();
    });

  }

  private update() {
    const tick = moment().toISOString();
    Object.entries(this.currentData)
      .forEach(
        ([idx, nd]) => {
          nd.timestamp = tick;
          const ds = this.chartData.datasets[idx];
          ds.data.shift();
          ds.data.push({
            x: nd.timestampDate,
            y: nd.temp
          });
        }
      );
    this.chart?.update();
  }
}