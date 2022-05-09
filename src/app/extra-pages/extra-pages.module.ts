import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExtraPagesRoutingModule } from './extra-pages-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PricingComponent } from './pricing/pricing.component';
import { FaqsComponent } from './faqs/faqs.component';
import { BlankComponent } from './blank/blank.component';

@NgModule({
  declarations: [
    ProfileComponent,
    InvoiceComponent,
    PricingComponent,
    FaqsComponent,
    BlankComponent,
  ],
  imports: [CommonModule, ExtraPagesRoutingModule, NgbModule],
})
export class ExtraPagesModule {}
