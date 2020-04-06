import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Location } from '@angular/common';
import { Attivita } from '../../shared/classes/Attivita.class';
import { ArchiviaCorsoModalComponent } from './modals/archivia-corso-modal/archivia-corso-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'cm-corsi',
  templateUrl: './corsi.component.html',
  styleUrls: ['./corsi.component.scss']
})
export class CorsiComponent implements OnInit {

  title: string = "Attività in corso";
  isArchivio: boolean;
  dataInizio;
  dataFine;
  corsodistudio;
  corsiStudio;
  totalRecords: number = 0;
  pageSize: number = 10;
  page: number = 0;
  corsi: Attivita[];
  classi;
  filtro = {
    titolo: "",
    anno: "",
    classe: "",
    dataInizio: 0,
    dataFine: 0,
    completata: false,
    corsoStudioId: "",
    interna: true,
    nomeStudente: ""
  };

  filterDatePickerConfig = {
    locale: 'it',
    firstDayOfWeek: 'mo'
  };

  emptyFilter: boolean = true;
  gestisciVedi: string = "Gestisci";

  //TODO: implement pagination with API

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.isArchivio = this.route.snapshot.url[0].path.indexOf('archivio') >= 0;
    if (this.isArchivio) {
      this.title = "Attività completate";
      this.filtro.completata = true;
      this.gestisciVedi = "Vedi";
    }

    //Restore filter states from reload
    this.restoreURLState();
    this.setFilterDates();
    this.dataService.getCorsiStudio().subscribe((response) => {
      this.corsiStudio = response;
      console.log(response);
    },
      (err: any) => console.log(err),
      () => console.log('get corsi studio'));
    this.dataService.getAttivitaGiornaliere(this.filtro, 0, this.pageSize).subscribe((res: any) => {
      this.totalRecords = res.totalElements

      this.corsi = res.content;
    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliere'));
  }
  setFilterDates() {
    if (this.dataInizio) {
      this.filtro.dataInizio = moment(this.dataInizio, 'DD-MMM-YYYY').valueOf();

    } else {
      this.filtro.dataInizio = 0;
    }
    if (this.dataFine) {
      this.filtro.dataFine = moment(this.dataFine, 'DD-MMM-YYYY').valueOf();
    } else {
      this.filtro.dataFine = 0;
    }
  }
  pageChanged(page: number) {
    this.dataService.getAttivitaGiornaliere(this.filtro, page-1, this.pageSize).subscribe((res: any) => {
      this.corsi = res.content;
      this.totalRecords = res.totalElements;

    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliere'));
    this.recreateFilterUrl();
  }
  completa(corso, stato) {
    const modalRef = this.modalService.open(ArchiviaCorsoModalComponent);
    modalRef.componentInstance.corso = corso;
    modalRef.componentInstance.onArchivia.subscribe(res => {
      this.dataService.archiviaAttivitaGiornaliera(corso, stato).subscribe(res => {
        this.ngOnInit();
      })
    });
  }

  filtra() {
    this.setFilterDates();
    this.emptyFilter = this.isEmptyFilter();
    this.dataService.getAttivitaGiornaliere(this.filtro, this.page-1, this.pageSize).subscribe((res: any) => {
      this.corsi = res.content;
      this.totalRecords = res.totalElements;
    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliere'));
    this.recreateFilterUrl();
  }
  selectCorsoFilter() {
    // get classi
    if (this.corsiStudio) {
      this.filtro.corsoStudioId = this.corsodistudio;
      // this.dataService.getClassiByCorso(this.corsodistudio).subscribe((res) => {
      //   this.classi = res.results;
      // },
      //   (err: any) => console.log(err),
      //   () => console.log('get attivita giornaliere'));
    } else {
      this.filtro.corsoStudioId = "";
    }
  }
  getCorsoClassOrStudentName(corso) {
    if (corso.individuale) { //if individuale return student name
      if (corso.studenti[0]) return corso.studenti[0].name + " " + corso.studenti[0].surname;
      else return "Nome Cognome"; //placeholder
    } else { //if not individuale and resolves an exception return number of students, else class name
      if (corso.eccezioneAttivitaAlternanzaId && corso.gestioneEccezione == "RISOLVE") {
        return corso.studenti.length + " studenti";
      } else {
        // return corso.classe;
        return corso.studenti.length + " studenti";
      }
    }
  }

  recreateFilterUrl() {
    let queryParams: any = {};
    if (this.filtro.titolo) {
      queryParams.titolo = this.filtro.titolo;
    }
    if (this.filtro.anno) {
      queryParams.anno = this.filtro.anno;
    }
    if (this.filtro.corsoStudioId) {
      queryParams.corsoStudioId = this.filtro.corsoStudioId;
    }

    if (this.filtro.classe) {
      queryParams.classe = this.filtro.classe;
    }
    if (this.filtro.dataInizio) {
      queryParams.dataInizio = this.filtro.dataInizio;
    }
    if (this.filtro.dataFine) {
      queryParams.dataFine = this.filtro.dataFine;
    }
    if (this.filtro.nomeStudente) {
      queryParams.nomeStudente = this.filtro.nomeStudente;
    }
    const url = this.router
      .createUrlTree([], { relativeTo: this.route, queryParams: queryParams })
      .toString();
    this.location.go(url);
  }
  restoreURLState() {
    this.filtro.titolo = this.route.snapshot.queryParamMap.get('titolo');
    this.filtro.nomeStudente = this.route.snapshot.queryParamMap.get('nomeStudente');
    this.filtro.anno = this.route.snapshot.queryParamMap.get('anno');
    this.filtro.classe = this.route.snapshot.queryParamMap.get('classe');
    this.filtro.dataInizio = +this.route.snapshot.queryParamMap.get('dataInizio');
    this.filtro.dataFine = +this.route.snapshot.queryParamMap.get('dataFine');
  }
  
  isEmptyFilter() {
    var empty:boolean = true;
    for(var key in this.filtro) {
        if (this.filtro.hasOwnProperty(key) && this.filtro[key]) {
            empty = false;
        }
    }
    return empty;
  }

}
