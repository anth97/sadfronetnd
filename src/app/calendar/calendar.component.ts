import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar } from './calendar.model';
import { CalendarService } from './calendar.service';
import { INITIAL_EVENTS } from './events-util';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass'],
  providers: [ToastrService],
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar', { static: false })
  calendar: Calendar | null;
  calendarForm: FormGroup;
  dialogTitle: string;
  filterOptions = 'All';
  calendarData: any;
  isEditClick: boolean;
  filterItems: string[] = [
    'work',
    'personal',
    'important',
    'travel',
    'friends',
  ];

  calendarEvents: EventInput[];
  tempEvents: EventInput[];

  public filters = [
    { name: 'work', value: 'Work', checked: true },
    { name: 'personal', value: 'Personal', checked: true },
    { name: 'important', value: 'Important', checked: true },
    { name: 'travel', value: 'Travel', checked: true },
    { name: 'friends', value: 'Friends', checked: true },
  ];

  @ViewChild('callAPIDialog', { static: false })
  callAPIDialog: TemplateRef<any>;

  @ViewChild('eventWindow')
  eventWindow: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    public calendarService: CalendarService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.dialogTitle = 'Add New Event';
    this.calendar = new Calendar({});
    this.calendarForm = this.createCalendarForm(this.calendar);
  }

  public ngOnInit(): void {
    this.calendarEvents = INITIAL_EVENTS;
    this.tempEvents = this.calendarEvents;
    this.calendarOptions.initialEvents = this.calendarEvents;
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };

  handleDateSelect(selectInfo: DateSelectArg) {
    this.eventWindowCall(selectInfo, 'addEvent');
  }
  eventWindowCall(row, type) {
    if (type === 'editEvent') {
      this.dialogTitle = row.event.title;
      this.isEditClick = true;
      this.calendarForm.setValue({
        id: row.event.id,
        title: row.event.title,
        category: row.event.groupId,
        startDate: formatDate(row.event.start, 'yyyy-MM-dd', 'en') || '',
        endDate: formatDate(row.event.end, 'yyyy-MM-dd', 'en') || '',
        details: row.event.extendedProps.details,
      });
    } else {
      this.calendarForm.reset();
      this.isEditClick = false;
    }

    this.modalService.open(this.eventWindow, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  saveEvent(form: FormGroup) {
    this.calendarData = form.value;
    this.calendarEvents = this.calendarEvents.concat({
      id: this.randomIDGenerate(5, 'abcdefghijklmnopqrstuvwxyz'),
      title: this.calendarData.title,
      start: this.calendarData.startDate,
      end: this.calendarData.endDate,
      className: this.getClassNameValue(this.calendarData.category),
      groupId: this.calendarData.category,
      details: this.calendarData.details,
    });
    this.calendarOptions.events = this.calendarEvents;
    this.calendarForm.reset();
    this.modalService.dismissAll();

    this.showNotification(
      'success',
      'Save Event Successfully...!!!',
      'top',
      'right'
    );
  }

  eventClick(form: FormGroup) {
    this.calendarData = form.value;

    this.calendarEvents.forEach(function (element, index) {
      if (this.calendarData.id === element.id) {
        this.saveEditEvent(index, this.calendarData);
      }
    }, this);
  }

  saveEditEvent(eventIndex, calendarData) {
    const calendarEvents = this.calendarEvents.slice();
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]);
    singleEvent.id = calendarData.id;
    singleEvent.title = calendarData.title;
    singleEvent.start = calendarData.startDate;
    singleEvent.end = calendarData.endDate;
    singleEvent.className = this.getClassNameValue(calendarData.category);
    singleEvent.groupId = calendarData.category;
    singleEvent.details = calendarData.details;
    calendarEvents[eventIndex] = singleEvent;
    this.calendarEvents = calendarEvents; // reassign the array

    this.calendarOptions.events = calendarEvents;

    this.calendarForm.reset();
    this.modalService.dismissAll();

    this.showNotification(
      'success',
      'Edit Event Successfully...!!!',
      'top',
      'right'
    );
  }

  changeCategory(event, filter) {
    if (event.target.checked) {
      this.filterItems.push(filter.name);
    } else {
      this.filterItems.splice(this.filterItems.indexOf(filter.name), 1);
    }
    this.filterEvent(this.filterItems);
  }

  filterEvent(element) {
    const list = this.calendarEvents.filter((x) =>
      element.map((y) => y).includes(x.groupId)
    );
    this.calendarOptions.events = list;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventWindowCall(clickInfo, 'editEvent');
  }

  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
  }

  createCalendarForm(calendar): FormGroup {
    return this.fb.group({
      id: [this.calendar.id],
      title: [this.calendar.title, [Validators.required]],
      category: [this.calendar.category],
      startDate: [this.calendar.startDate, [Validators.required]],
      endDate: [this.calendar.endDate, [Validators.required]],
      details: [this.calendar.details],
    });
  }

  getClassNameValue(category) {
    let className: string;

    if (category === 'work') {
      className = 'fc-event-success';
    } else if (category === 'personal') {
      className = 'fc-event-warning';
    } else if (category === 'important') {
      className = 'fc-event-primary';
    } else if (category === 'travel') {
      className = 'fc-event-danger';
    } else if (category === 'friends') {
      className = 'fc-event-info';
    }

    return className;
  }
  public randomIDGenerate(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }
  showNotification(eventType, message, ypos, xpos) {
    if (eventType === 'success') {
      this.toastr.success(message, '', {
        positionClass: 'toast-' + ypos + '-' + xpos,
      });
    }
  }
}
