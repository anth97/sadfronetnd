import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { WidgetRoutingModule } from './widget-routing.module';
import { ChartWidgetComponent } from './chart-widget/chart-widget.component';
import { DataWidgetComponent } from './data-widget/data-widget.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule as chartjsModule } from 'ng2-charts';

@NgModule({
  declarations: [ChartWidgetComponent, DataWidgetComponent],
  imports: [
    CommonModule,
    NgbModule,
    WidgetRoutingModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    chartjsModule,
  ],
})
export class WidgetModule {}
