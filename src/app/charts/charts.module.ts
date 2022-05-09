import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import { ApexchartComponent } from './apexchart/apexchart.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { EchartComponent } from './echart/echart.component';
import { GaugeComponent } from './gauge/gauge.component';
import { NgxchartComponent } from './ngxchart/ngxchart.component';

import { GaugeModule } from 'angular-gauge';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartsModule as chartjsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ApexchartComponent,
    ChartjsComponent,
    EchartComponent,
    GaugeComponent,
    NgxchartComponent,
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    chartjsModule,
    NgxChartsModule,
    NgApexchartsModule,
    GaugeModule.forRoot(),
    NgxGaugeModule,
  ],
})
export class ChartsModule {}
