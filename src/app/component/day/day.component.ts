import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { SensorLocation } from '../../entity/location.emtity';
import { PERIOD } from '../../entity/api.entity';
import { BehaviorSubject, merge } from 'rxjs';
import { NowDataModel } from '../../models/nowdata.model';
import { ChartConfiguration } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { head } from 'lodash-es';
import { CHART_COLORS, transparentize } from '../../utils.chartjs';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { DragScrollDirective } from '../../drag-scroll.directive';
import moment from 'moment-timezone';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';


interface CurrentData {
  [key: number]: NowDataModel;
}


@Component({
  selector: 'app-day',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatButtonModule,
    MatRippleModule,
    RouterModule,
    DragScrollDirective,
    MatIconModule,
  ],
  templateUrl: './day.component.html',
})
export class DayComponent implements OnInit {

  private $dataSubject = new BehaviorSubject<NowDataModel[] | null>(null);
  $data = this.$dataSubject.asObservable();

  public chartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start'
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
    scales: {
      x: {
        type: "timeseries",
        time: {
          unit: 'hour',
          round: 'hour',
          displayFormats: {
            hour: "HH:mm"
          },

        },
        reverse: true,
        title: {
          font: {
            family: "Ubuntu Condensed",
            weight: 'bolder'
          }
        },
        ticks: {
          callback: function (value, index, ticks) {
            return moment(value).fromNow();
          },
        }
      },
      y: {
        offset: false,
        display: false,
        ticks: {
          callback: function (value, index, ticks) {
            return Number(value).toFixed(1) + "°C";
          },
        }
      }
    },
  };

  public chartData: any = {
    datasets: [
      {
        data: [],
        label: "Indoor",
        borderColor: CHART_COLORS.red,
        backgroundColor: transparentize(CHART_COLORS.red, 0.5),
        borderWidth: 2,
        borderRadius: 5,
        // barPercentage: 1,
        borderSkipped: false,
      },
      {
        data: [],
        label: "Outdoor",
        borderColor: CHART_COLORS.blue,
        backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
        borderWidth: 2,
        borderRadius: 5,
        // barPercentage: 1,
        borderSkipped: false,
      }
    ],
    labels: []
  };



  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private currentData: CurrentData = {}

  sensors: SensorLocation[] = [SensorLocation.INDOOR, SensorLocation.OUTDOOR]

  dataSets = {
    [SensorLocation.INDOOR]: 0,
    [SensorLocation.OUTDOOR]: 1
  };
  constructor(private api: ApiService) {

  }


  ngOnInit(): void {


    merge(
      this.api.getHistory(SensorLocation.INDOOR, PERIOD.DAY),
      this.api.getHistory(SensorLocation.OUTDOOR, PERIOD.DAY),
    ).subscribe((data: NowDataModel[]) => {
      const sensor = (head(data) as NowDataModel).location
      const dataset = data.map((m: NowDataModel) => ({ y: m.temp, x: m.timestampDate }));
      this.chartData.datasets[this.dataSets[sensor]].data = dataset;
      this.chart?.update();
    });

  }


}
