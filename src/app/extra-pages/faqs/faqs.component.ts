import { FAQS } from './faqs.model';
import { FaqService } from './faq.service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.sass'],
  providers: [FaqService],
})
export class FaqsComponent {
  faqs: FAQS[];

  constructor(private faqService: FaqService) {
    this.faqs = faqService.faqs;
  }

  filter(searchValue: string) {
    if (searchValue === '') {
      this.faqs = this.faqService.faqs;
    } else {
      this.faqs = this.faqService.faqs.filter(
        (faqs: FAQS) =>
          faqs.title.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1 ||
          faqs.content.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1
      );
    }
  }
}
