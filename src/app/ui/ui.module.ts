import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiRoutingModule } from './ui-routing.module';
import { AlertsComponent } from './alerts/alerts.component';
import { BadgesComponent } from './badges/badges.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapseComponent } from './collapse/collapse.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ListComponent } from './list/list.component';
import { ModalsComponent } from './modals/modals.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ProgressbarsComponent } from './progressbars/progressbars.component';
import { AccordionComponent } from './accordion/accordion.component';
import { TabsComponent } from './tabs/tabs.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { RatingsComponent } from './ratings/ratings.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CarouselComponent } from './carousel/carousel.component';
import { PopoverComponent } from './popover/popover.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { TypographyComponent } from './typography/typography.component';

@NgModule({
  declarations: [
    AlertsComponent,
    BadgesComponent,
    ButtonsComponent,
    CollapseComponent,
    DropdownComponent,
    ListComponent,
    ModalsComponent,
    DatepickerComponent,
    PaginationComponent,
    ProgressbarsComponent,
    AccordionComponent,
    TabsComponent,
    TimepickerComponent,
    RatingsComponent,
    TooltipComponent,
    CarouselComponent,
    PopoverComponent,
    TypeaheadComponent,
    TypographyComponent,
  ],
  imports: [
    CommonModule,
    UiRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UiModule {}
