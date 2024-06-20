import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { SensorLocation } from '../../entity/location.emtity';
import { PERIOD } from '../../entity/api.entity';
import { BehaviorSubject, mapTo, merge } from 'rxjs';
import { NowDataModel } from '../../models/nowdata.model';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { head } from 'lodash-es';
import { CHART_COLORS, transparentize } from '../../utils.chartjs';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatRipple } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

interface CurrentData {
  [key: number]: NowDataModel;
}

@Component({
  selector: 'app-week',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatRipple,
  ],
  templateUrl: './week.component.html',
})
export class WeekComponent implements OnInit {
  private $dataSubject = new BehaviorSubject<NowDataModel[] | null>(null);
  $data = this.$dataSubject.asObservable();

  public chartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        color: '#fff',
        align: 'end',
        offset: 5,
        font: {
          family: "'Ubuntu Condensed'",
          size: 15,
        },
        formatter: function (value, context: Context) {
          const dIdx = context.dataIndex;
          const data = context.dataset.data as Array<any>;
          const previous = data[dIdx - 1] || null;
          return value.y.toFixed(1) + '°C';
        },
      },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: 'day',
        },
        stacked: true,
      },
      y: {
        offset: true,
        min: 0,
        max: 40,
        ticks: {
          callback: function (value, index, ticks) {
            return Number(value).toFixed(1) + '°C';
          },
        },
        stacked: false,
      },
    },
  };

  public chartData: any = {
    datasets: [
      {
        data: [],
        label: 'Indoor MIN',
        borderColor: CHART_COLORS.blue,
        backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
        stack: 'Stack 0',
      },
      {
        data: [],
        label: 'Outdoor MIN',
        borderColor: CHART_COLORS.blue,
        backgroundColor: transparentize(CHART_COLORS.blue, 0.1),
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        stack: 'Start 1',
      },
      {
        data: [],
        label: 'Indoor MAX',
        borderColor: CHART_COLORS.red,
        backgroundColor: CHART_COLORS.red,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        stack: 'Stack 0',
      },
      {
        data: [],
        label: 'Outdoor MAX',
        borderColor: CHART_COLORS.purple,
        backgroundColor: CHART_COLORS.purple,
        borderWidth: 2,
        borderRadius: 5,
        width: 20,
        borderSkipped: false,
        stack: 'Start 1',
      },
    ],
    labels: [],
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private currentData: CurrentData = {};

  sensors: SensorLocation[] = [SensorLocation.INDOOR, SensorLocation.OUTDOOR];

  dataSets = {
    [SensorLocation.INDOOR]: 0,
    [SensorLocation.OUTDOOR]: 1,
  };
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    merge(
      this.api.getHistory(SensorLocation.INDOOR, PERIOD.WEEK),
      this.api.getHistory(SensorLocation.OUTDOOR, PERIOD.WEEK)
    ).subscribe((data: NowDataModel[]) => {
      const sensor = (head(data) as NowDataModel).location;
      this.chartData.datasets[this.dataSets[sensor] + 2].data = data.map(
        (m: NowDataModel) => ({ y: m.temp, x: m.timestampDay })
      );
      this.chartData.datasets[this.dataSets[sensor]].data = data.map(
        (m: NowDataModel) => ({ y: m.temp_min, x: m.timestampDay })
      );
      console.log(this.chartData.datasets);
      this.chart?.update();
    });
  }
}
