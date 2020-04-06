import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { AttivitaGiornaliera } from '../../../shared/classes/AttivitaGiornaliera.class';
import { CompetenzaDetailModalComponent } from '../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { NewDayPresenzeModalComponent } from './new-day-presenze-modal/new-day-presenze-modal.component';

import * as moment from 'moment';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';

@Component({
  selector: 'cm-corso-presenze',
  templateUrl: './corso-presenze.component.html',
  styleUrls: ['./corso-presenze.component.css']
})
export class CorsoPresenzeComponent implements OnInit {

  navTitle: string = "Presenze corso";
  breadcrumbItems = [
    {
      title: "Lista corsi",
      location: "../../"
    },
    {
      title: "Presenze corso",
      location: "./"
    }
  ];

  corso;
  studenti;
  studentiIds;
  paginationIndex: number = 0;
  isArchivio: boolean;
  calendar;
  idEsperienza;
  presenzaStudenti = [];
  defaultHour = 8;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.idEsperienza = id;

      this.dataService.getAttivitaAlternanzaById(id).subscribe(attivita => {
        this.corso = attivita;
        this.setCalendar(attivita, true);
				this.navTitle = this.corso.titolo + " - " + this.corso.corso;
        this.dataService.getAttivitaGiornalieraCalendario(id).subscribe((studenti: any) => {
          this.studenti = studenti;
          this.initDays();
          this.isArchivio = this.corso.completata;
          if (this.isArchivio) {
            this.breadcrumbItems[0].title = "Archivio corsi";
            this.breadcrumbItems[0].location = "../../";
          }
          //this.navTitle = corso.titolo + " - Presenze";
          this.optimizeCheckboxesStates();
          this.setHoursOfStudents();
        },
          (err: any) => console.log(err),
          () => console.log('get attivita giornaliera calendario by id'));
      },
        (err: any) => console.log(err),
        () => console.log('get attivita giornaliera by id'));


    });
  }

  openDetailCompetenza(competenza) {
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }

  setCalendar(attivita, init) {
    this.calendar = [];
    var startDate;
    if (init)
      startDate = moment(attivita.dataInizio).startOf('isoWeek').valueOf();
    else startDate = moment(attivita.dataInizio).startOf('isoWeek').add((this.paginationIndex), 'week').valueOf();
    this.calendar.push(startDate);
    for (var i = 0; i < 6; i++) {
      let newDay = moment(this.calendar[this.calendar.length - 1]);
      this.calendar.push(newDay.add(1, 'days').valueOf());
    }
    this.calendar;
  }
  setHoursOfStudents() {
    for (var k = 0; k < this.studentiIds.length; k++)
      this.presenzaStudenti[this.studentiIds[k]] = this.getPresenzaStudenti(this.studenti[this.studentiIds[k]], this.paginationIndex)
  }
  getPresenzaStudenti(studente, pageNumber) {
    var days = [];
    if (!studente)
      days = [];
    else
      days = studente.giornate;
    //filll the gap
    days = this.fillDaysGap(days, pageNumber);
    return days
  }
  fillDaysGap(days, pageNumber) {
    var tmp = [];
    var k = 0;
    var data1
    var data2
    for (var i = 0; i < 7; i++) {
      var tmpMap = days.map(day => day.data);
      var found = tmpMap.indexOf(moment(this.calendar[i]).format('YYYY-MM-DD'))
      if (found >= 0) {
        // if (days[k] && data1 === data2) {
        tmp.push(days[found])
        k++;
      }
      else {
        tmp.push({
          oreSvolte: 0,
          data: moment(this.calendar[i]).format('YYYY-MM-DD')
        })
      }
    }
    return tmp;
  }

  getPaginatedStudentePresenze(studente, pageNumber) {
    if (!studente) return [];
    return studente.giornate.slice(pageNumber * 7, pageNumber * 7 + 7);
  }

  selectAllPresenze(event) {
    this.studentiIds.forEach(studenteId => {
      this.getPaginatedStudentePresenze(this.studenti[studenteId], this.paginationIndex).forEach(giornata => {
        giornata.presente = event.target.checked;
      });
    });
    this.optimizeCheckboxesStates();
  }

  isAllChecked() {
    if (!this.allStudentOfDayChecked) return false;
    return this.allStudentOfDayChecked.every(day => day);
  }

  selectAllDaysOfStudent(studente, state) {
    this.getPaginatedStudentePresenze(studente, this.paginationIndex).forEach(giornata => {
      giornata.presente = state;
    });
    this.optimizeCheckboxesStates();
  }

  selectAllStudentsOfDay(giornata, dayIndex, state) {
    this.studentiIds.forEach(studenteId => {
      this.studenti[studenteId].giornate[this.paginationIndex * 7 + dayIndex].presente = state;
    });
    this.optimizeCheckboxesStates();
  }

  alldaysOfStudentChecked: boolean[] = [];
  allStudentOfDayChecked: boolean[] = [];

  //set the states of "header" checkboxes reading only one time the matrix
  optimizeCheckboxesStates() {
    this.alldaysOfStudentChecked = [];
    this.allStudentOfDayChecked = [];
    for (var studenteId in this.studenti) {
      this.getPaginatedStudentePresenze(this.studenti[studenteId], this.paginationIndex).forEach(element => {
        this.allStudentOfDayChecked.push(true);
      });
      break;
    }
    for (var studenteId in this.studenti) {
      this.alldaysOfStudentChecked.push(true);
      let days = this.getPaginatedStudentePresenze(this.studenti[studenteId], this.paginationIndex);
      for (let i = 0; i < days.length; i++) {
        if (!days[i].presente) {
          this.alldaysOfStudentChecked[this.alldaysOfStudentChecked.length - 1] = false;
          this.allStudentOfDayChecked[i] = false;
        }
      }
    }
  }

  getAllDaysOfStudentChecked(studentIndex) {
    if (!this.alldaysOfStudentChecked || this.alldaysOfStudentChecked.length < studentIndex) {
      return false;
    }
    return this.alldaysOfStudentChecked[studentIndex];
  }

  setDefaultHourToAllStudents(dayIndex) {
    //set for all Students at that day, defaultHour
    var tmp = [];
    for (var key in this.presenzaStudenti) {
      this.presenzaStudenti[key][dayIndex].oreSvolte = this.defaultHour;
      this.presenzaStudenti[key][dayIndex].verificata = false;
    }


  }
  getAllStudentsOfDayChecked(dayIndex) {
    if (!this.allStudentOfDayChecked || this.allStudentOfDayChecked.length < dayIndex) {
      return false;
    }
    return this.allStudentOfDayChecked[dayIndex];
  }

  isDaysBackAvailable() {
    return this.paginationIndex > 0;
  }
  isDaysForwardAvailable() {
    var inizio = moment(this.corso.dataInizio).startOf('isoWeek');
    var fine = moment(this.corso.dataFine).endOf('isoWeek');
    return fine.diff(inizio, 'week') > this.paginationIndex
  }
  isDayBetween(giornata) {
    var inizio = moment(this.corso.dataInizio);
    var fine = moment(this.corso.dataFine);
    var day = moment(giornata);
    return day.isBetween(inizio, fine, null, "[]");
  }

  navigateDaysBack() {
    if (this.isDaysBackAvailable()) {
      // if (!this.isArchivio) {
      //   this.convertPresencesIntoStudenti();
      //   this.dataService.saveAttivitaGiornaliereStudentiPresenze(this.studenti).subscribe((studenti: any) => {
      //     this.growler.growl("Presenze aggiornate con successo", GrowlerMessageType.Success);
      //     this.paginationIndex--;
      //     this.optimizeCheckboxesStates();
      //     this.setCalendar(this.corso, false);
      //     this.setHoursOfStudents();
      //   },
      //     (err: any) => console.log(err),
      //     () => console.log('save attivita giornaliera presenze'));
      // } else {
        this.paginationIndex--;
        this.optimizeCheckboxesStates();
        this.setCalendar(this.corso, false);
        this.setHoursOfStudents();
      }
    // }

  }
  navigateDaysForward() {
    if (this.isDaysForwardAvailable()) {
      // if (!this.isArchivio) {
      //   this.convertPresencesIntoStudenti();
      //   this.dataService.saveAttivitaGiornaliereStudentiPresenze(this.studenti).subscribe((studenti: any) => {
      //     this.growler.growl("Presenze aggiornate con successo", GrowlerMessageType.Success);
      //     this.paginationIndex++;
      //     this.optimizeCheckboxesStates();
      //     this.setCalendar(this.corso, false);
      //     this.setHoursOfStudents();
      //   },
      //     (err: any) => console.log(err),
      //     () => console.log('save attivita giornaliera presenze'));
      // } else {
        this.paginationIndex++;
        this.optimizeCheckboxesStates();
        this.setCalendar(this.corso, false);
        this.setHoursOfStudents();
      }
    // }
  }
  savePresences() {
    this.convertPresencesIntoStudenti();
    this.dataService.saveAttivitaGiornaliereStudentiPresenze(this.studenti).subscribe((studenti: any) => {
      this.growler.growl("Presenze aggiornate con successo", GrowlerMessageType.Success);
      // this.router.navigate(['../'], { relativeTo: this.route });
    },
      (err: any) => console.log(err),
      () => console.log('save attivita giornaliera presenze'));
  }
  convertPresencesIntoStudenti() {
    //save into this.studenti this presenzaStudenti
    //per ogni elemento della mappa presenzaStudenti
    for (var key in this.presenzaStudenti) {
      //merge presenza with giornate
      for (var i = 0; i < this.presenzaStudenti[key].length; i++) {
        var index = this.studenti[key].giornate.map(day => day.data).indexOf(this.presenzaStudenti[key][i].data)
        if (index >= 0) {
          this.studenti[key].giornate[index] = this.presenzaStudenti[key][i];
        }
        if (this.studenti[key].giornate[index]) {
          this.studenti[key].giornate[index].verificata = true;
        }
      }
    }


  }

  initDays() {
    var a = moment(this.corso.dataInizio).startOf('day');
    var b = moment(this.corso.dataFine).endOf('day');
    var tot = b.diff(a, 'days');   // =1
    this.studentiIds = Object.keys(this.studenti);
    for (var i = 0; i < this.studentiIds.length; i++) {
      if (this.studenti[this.studentiIds[i]].giornate.length < (tot + 1))
        this.initDaysStudent(this.studentiIds[i]);
    }
  }
  initDaysStudent(key) {
    // put objecty
    var startDate = moment(this.corso.dataInizio);
    var endDate = moment(this.corso.dataFine);
    var now = startDate.clone();
    while (now.diff(endDate, 'days') <= 0) {
      // while (now.isSameOrBefore(endDate)) {
      this.studenti[key].giornate.push({
        "data": now.format('YYYY-MM-DD'),
        "presente": false,
        "oreSvolte": 0,
        "attivitaSvolta": ""
      });
      now.add(1, 'days');
    }
  }
  createNewDay() {
    const modalRef = this.modalService.open(NewDayPresenzeModalComponent);
    modalRef.componentInstance.onCreate.subscribe(day => {
      let date = moment(day).format('YYYY-MM-DD');
      for (var studenteId in this.studenti) {
        let dayObject = {
          "data": date,
          "presente": false
        };
        this.studenti[studenteId].giornate.push(dayObject);
      }

      //navigate to the last page
      for (var studenteId in this.studenti) {
        this.paginationIndex = Math.floor((this.studenti[studenteId].giornate.length - 1) / 7);
        break;
      }
      this.optimizeCheckboxesStates();
    });
  }

  edit(giornata) {
    giornata.verificata = false;
  }

}
