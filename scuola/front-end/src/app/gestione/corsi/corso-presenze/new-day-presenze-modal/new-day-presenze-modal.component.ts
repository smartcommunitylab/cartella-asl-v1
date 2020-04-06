import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'cm-new-day-presenze-modal',
  templateUrl: './new-day-presenze-modal.component.html'
})
export class NewDayPresenzeModalComponent implements OnInit {

  @Output() onCreate = new EventEmitter<Moment>();

  presenceDay:Moment;  
  filterDatePickerConfig = {
    locale: 'it',
    firstDayOfWeek: 'mo'
  };

  isDateInvalid:boolean = false;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  addDay() {
    if (this.presenceDay && (this.presenceDay instanceof moment) && this.presenceDay.isValid()) {
      this.onCreate.emit(this.presenceDay);
      this.activeModal.close();
    } else {
      this.isDateInvalid = true;
    }
  }
}
