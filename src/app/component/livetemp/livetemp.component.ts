import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NowDataModel } from '../../models/nowdata.model';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, Chart, } from 'chart.js';
import moment, { Moment } from 'moment';
import { DatabaseService } from '../../service/db.service';
import { last, takeRightWhile } from 'lodash-es';
import { interval } from 'rxjs';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, colorSets } from '@swimlane/ngx-charts';


import { ChangeDetectionStrategy, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import {
  BaseChartComponent,
  calculateViewDimensions,
  ColorHelper,
  id,
  ScaleType,
  ViewDimensions
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-livetemp',
  standalone: true,
  imports: [
    CommonModule,
    CanvasJSAngularChartsModule,
    NgxChartsModule
  ],
  templateUrl: './livetemp.component.html',
  styleUrl: './livetemp.component.scss'
})
export class LivetempComponent extends BaseChartComponent implements OnInit {

  chartOptions = {
    title: {
      text: "Basic Column Chart in Angular"
    },
    data: [{
      type: "column",
      dataPoints: [
        { label: "Apple", y: 10 },
        { label: "Orange", y: 15 },
        { label: "Banana", y: 25 },
        { label: "Mango", y: 30 },
        { label: "Grape", y: 28 }
      ]
    }]
  };



  @Output() onFilter = new EventEmitter();





  // ngOnInit(): void {
  //   // this.api.getHistory().subscribe((models: NowDataModel[]) => {
  //   //   const data = models.map((m) => ({ y: m.temp, x: m.timestampDate }));
  //   //   this.currentData = last(models) as NowDataModel;
  //   //   this.chartData.datasets[0].data = data;
  //   //   this.chart?.update();
  //   //   interval(5000).subscribe(() => {
  //   //     this.currentData.timestamp = moment().toISOString();
  //   //     this.update();
  //   //   });
  //   //   this.db.$indoor.subscribe((data: any) => {
  //   //     this.currentData = data as NowDataModel;
  //   //   });
  //   // });
  // }

  // private update() {
  //   // this.chartData.datasets[0].data.shift();
  //   // this.chartData.datasets[0].data.push({
  //   //   x: this.currentData.timestampDate,
  //   //   y: this.currentData.temp
  //   // });
  //   // this.chart?.update();
  // }

  override update(): void {
    super.update();
    this.dims = calculateViewDimensions({
      width: '600px',
      height: '400px',
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: false,
      legendType: this.schemeType
    });

    this.xDomain = this.getXDomain();

    this.yDomain = this.getYDomain();
    this.timeScale = this.getTimeScale(this.xDomain, this.dims.width);
    this.xScale = this.getXScale(this.xSet, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);

    this.setColors();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    if (this.brush) {
      this.updateBrush();
    }

    this.filterId = 'filter' + id().toString();
    this.filter = `url(#${this.filterId})`;

    if (!this.initialized) {
      this.addBrush();
      this.initialized = true;
    }
  }

  getXDomain(): any[] {
    const values: any[] = [];

    for (const d of this.results) {
      if (!values.includes(d.name)) {
        values.push(d.name);
      }
    }

    this.scaleType = this.getScaleType(values);
    let domain = [];

    const min = new Date(Math.min(...values));
    min.setHours(0);
    min.setMinutes(0);
    min.setSeconds(0);

    const max = new Date(Math.max(...values));
    max.setHours(23);
    max.setMinutes(59);
    max.setSeconds(59);

    domain = [min.getTime(), max.getTime()];

    this.xSet = values;
    return domain;
  }

  getYDomain(): any[] {
    if (this.valueDomain) {
      return this.valueDomain;
    }

    const domain = [];

    for (const d of this.results) {
      if (domain.indexOf(d.value) < 0) {
        domain.push(d.value);
      }
      if (d.min !== undefined) {
        if (domain.indexOf(d.min) < 0) {
          domain.push(d.min);
        }
      }
      if (d.max !== undefined) {
        if (domain.indexOf(d.max) < 0) {
          domain.push(d.max);
        }
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(...domain);
    if (!this.autoScale) {
      min = Math.min(0, min);
    }

    return [min, max];
  }

  getXScale(domain:any, width:any): any {
    return scaleBand().range([0, width]).paddingInner(0.1).domain(domain);
  }

  getTimeScale(domain:any, width:any): any {
    return scaleTime().range([0, width]).domain(domain);
  }

  getYScale(domain:any, height:any): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);

    return scale;
  }

  getScaleType(values:any): ScaleType {
    return ScaleType.Time;
  }

  trackBy(index:any, item:any): string {
    return `${item.name}`;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.xSet;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  updateYAxisWidth({ width=200}): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height=300 }): void {
    this.xAxisHeight = height;
    this.update();
  }

  addBrush(): void {
    if (this.brush) return;

    const height = this.height;
    const width = this.width;

    this.brush = brushX()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('brush end', ({ selection }) => {
        const newSelection = selection || this.xScale.range();
        const newDomain = newSelection.map(this.timeScale.invert);

        this.onFilter.emit(newDomain);
        this.cd.markForCheck();
      });

    select(this.chartElement.nativeElement).select('.brush').call(this.brush);
  }

  updateBrush(): void {
    if (!this.brush) return;

    const height = this.dims.height;
    const width = this.dims.width;

    this.brush.extent([
      [0, 0],
      [width, height]
    ]);
    select(this.chartElement.nativeElement).select('.brush').call(this.brush);

    // clear hardcoded properties so they can be defined by CSS
    select(this.chartElement.nativeElement)
      .select('.selection')
      .attr('fill', "")
      .attr('stroke', "")
      .attr('fill-opacity', "");

    this.cd.markForCheck();
  }

}
