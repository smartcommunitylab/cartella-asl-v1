import { Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IPagedResults, EsperienzaSvolta, DiarioDiBordo, Giornate } from '../../shared/interfaces';
import { DataService } from '../../core/services/data.service';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { isBefore, startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, startOfISOWeek, endOfISOWeek, getISOWeek, getYear, isAfter, isSameISOWeek } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../core/modal/modal.component'
import { ModalService, IModalContent } from '../../core/modal/modal.service'
import { registerLocaleData } from '@angular/common';
import { GrowlerService, GrowlerMessageType } from '../../core/growler/growler.service';
import { Observable } from 'rxjs/Rx';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

declare var moment: any;
moment['locale']('it');


@Component({
  selector: 'cm-attivita-presenze',
  templateUrl: './attivita-presenze.component.html',
  styleUrls: ['./attivita-presenze.component.css']
})
export class AttivitaPresenzeComponent implements OnInit {

  @Input() esperienzaSvolta: EsperienzaSvolta;
  @Input() tipologiaEsperienza;

  titolo: string;
  states = [{ "id": 1, "name": "Presente" }, { "id": 2, "name": "Assente" }];

  view: string = 'week';
  titleWeek: string;
  periodStartDate: number;
  periodEndDate: number;
  viewDate: Date; //set this date to starting point of period.
  viewEndDate: Date;
  presenzaStudente = [];
  events: any = [];
  studenti;
  calendar;
  eventWindow: any = []; // visible event per selected week.
  frontArrowDisabled: boolean = false;
  backArrowDisabled: boolean = false;

  constructor(
    private modalService: ModalService,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private growler: GrowlerService) {

  }

  ngOnInit() {    
    this.viewDate = new Date(Number(this.esperienzaSvolta.attivitaAlternanza.dataInizio));
    this.viewEndDate = new Date(Number(this.esperienzaSvolta.attivitaAlternanza.dataFine));

    let numberOfDays = 0;
    let creaGiorni: Promise<any>[] = [];
    //get calendar and build the diary
      this.dataService.getStudenteAttivitaGiornalieraCalendario(this.esperienzaSvolta.attivitaAlternanza["id"], this.esperienzaSvolta["studente"].id).subscribe((studenti: any) => {
      this.studenti = studenti;
      // if (this.studenti[this.esperienzaSvolta["studente"].id].giornate.length == 0)
        this.initDays();
      for (let addedGiorno of this.studenti[this.esperienzaSvolta["studente"].id].giornate) {
        this.events.push(addedGiorno);
        this.viewDatechanged();
      }
      this.setCalendar(this.esperienzaSvolta.attivitaAlternanza);
      this.setHoursOfStudent();
    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliera calendario by id'));


  }


  initDays() {
    // put objecty
    var startDate = moment(this.esperienzaSvolta.attivitaAlternanza.dataInizio);
    var endDate = moment(this.esperienzaSvolta.attivitaAlternanza.dataFine);
    var tot = endDate.diff(startDate, 'days');   // =1

    var now = startDate.clone();
    if (this.studenti[this.esperienzaSvolta["studente"].id].giornate.length < (tot + 1))
      while (now.diff(endDate, 'days') <= 0) {
        var index = this.studenti[this.esperienzaSvolta["studente"].id].giornate.map(day => day.data).indexOf(now.format('YYYY-MM-DD'));
        if (index < 0) {
          this.studenti[this.esperienzaSvolta["studente"].id].giornate.push({
            "data": now.format('YYYY-MM-DD'),
            "presente": false,
            "oreSvolte": 0,
            "attivitaSvolta": ""
          });
        }
        now.add(1, 'days');
      }
  }

  daydiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }
  todayIsBetween() {
    var today = moment();
    var inizio = this.esperienzaSvolta.attivitaAlternanza.dataInizio;
    var fine = this.esperienzaSvolta.attivitaAlternanza.dataFine;
    return today.isBetween(inizio, fine, null, "[]")
  }
  viewDatechanged() {
    this.eventWindow = [];
    let windowStart = this.viewDate;
    let startOfWeek = startOfISOWeek(windowStart);
    let endOfWeek = endOfISOWeek(windowStart);
    for (var eventIndex = 0; eventIndex < this.events.length; eventIndex++) {
      if (isSameISOWeek(this.events[eventIndex].data, startOfWeek)) {
        this.eventWindow.push(this.events[eventIndex]);
      }
    }

    var s = moment(startOfWeek);
    var e = moment(endOfWeek);

    this.titleWeek = s.format('DD MMMM') + " - " + e.format('DD MMMM');

    // if -1 day from start of week is less than dataInizio of activity disable back arrow.
    if (isBefore(addDays(startOfWeek, -1), new Date(this.esperienzaSvolta.attivitaAlternanza.dataInizio))) {
      this.backArrowDisabled = true;
    } else {
      this.backArrowDisabled = false;
    }
    // if +1 day from end of week is greater than dataFine of activity disable forward arrow.
    if (isAfter(addDays(endOfWeek, 1), new Date(this.esperienzaSvolta.attivitaAlternanza.dataFine))) {
      this.frontArrowDisabled = true;
    } else {
      this.frontArrowDisabled = false;
    }

  }

  edit(event: Giornate, newHour) {
    event.verificata = false;
    event.isModifiedState = true;
    // update the right element 
    var foundIndex = this.presenzaStudente.map(giornata => giornata.data).indexOf(event.data);
    if (isNumber(newHour)) {
      this.presenzaStudente[foundIndex].oreSvolte = newHour
    }
    // var index = this.esperienzaSvolta["presenze"].giornate.map(day => day.data).indexOf(this.presenzaStudente[i].data)

  }

  savePresenze() {
    this.convertPresencesIntoStudente();
    this.dataService.saveAttivitaGiornaliereStudentiPresenze(this.studenti).subscribe((studente: any) => {
      this.growler.growl("Presenze aggiornate con successo", GrowlerMessageType.Success);
      // this.router.navigate(['../'], { relativeTo: this.route });
    },
      (err: any) => console.log(err),
      () => console.log('save attivita giornaliera presenze'));
  }


  convertPresencesIntoStudente() {
    //save into this.studenti this presenzaStudenti
    //per ogni elemento della mappa presenzaStudenti
    //merge presenza with giornate
    if (!this.studenti[this.esperienzaSvolta["studente"].id].giornate) {
      this.studenti[this.esperienzaSvolta["studente"].id].giornate = [];
    }
    for (var i = 0; i < this.presenzaStudente.length; i++) {
      var index = this.studenti[this.esperienzaSvolta["studente"].id].giornate.map(day => day.data).indexOf(this.presenzaStudente[i].data)
      if (index >= 0) {
        // this.esperienzaSvolta["presenze"].giornate[index] = this.presenzaStudente[i];
        this.studenti[this.esperienzaSvolta["studente"].id].giornate[index] = this.presenzaStudente[i];
      }
      else {
        this.studenti[this.esperienzaSvolta["studente"].id].giornate.push(this.presenzaStudente[i]);
      }

    }
  }

  getPresenzaStudente(event) {
    var foundPresenza = [];
    if (this.studenti[this.esperienzaSvolta["studente"].id])
      foundPresenza = this.studenti[this.esperienzaSvolta["studente"].id].giornate.filter(giorno => giorno.data == event.data);
    if (foundPresenza.length > 0)
      return foundPresenza[0].oreSvolte
    else return 0
  }
  setCalendar(attivita) {
    this.calendar = [];
    var startDate = moment(attivita.dataInizio);
    var endDate = moment(attivita.dataFine);
    this.calendar.push(startDate);
    // for (var i = 0; i < 6; i++) {
    let newDay = moment(this.calendar[this.calendar.length - 1]);
    while (newDay < endDate) {
      newDay = moment(this.calendar[this.calendar.length - 1]);
      this.calendar.push(newDay.add(1, 'days').valueOf());
    }
    this.calendar;
  }
  setHoursOfStudent() {
    this.presenzaStudente = this.getPresenzaStudenti()
  }
  getPresenzaStudenti() {
    var days = [];
    if (this.studenti && this.esperienzaSvolta) {
      if (this.studenti[this.esperienzaSvolta["studente"].id])
        days = this.studenti[this.esperienzaSvolta["studente"].id].giornate;
      else
        days = [];
      days = this.fillDaysGap(days);
    }
    return days
  }
  fillDaysGap(days) {
    var tmpDays = [];
    for (var i = 0; i < this.calendar.length; i++) {
      var tmpMap = days.map(day => day.data);
      var found = tmpMap.indexOf(moment(this.calendar[i]).format('YYYY-MM-DD'))
      if (found >= 0) {
        tmpDays.push(days[found])
      }
      else {
        tmpDays.push({
          oreSvolte: 0,
          data: moment(this.calendar[i]).format('YYYY-MM-DD')
        })
      }
    }

    return tmpDays;
  }

}
