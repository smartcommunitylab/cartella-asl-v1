import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PianoAlternanza } from '../../../shared/classes/PianoAlternanza.class';
import { ProgrammazioneService } from '../../../core/services/programmazione.service';
import { ProgrammaCancellaAttivitaModal } from '../actions/cancella-attivita-modal/programma-cancella-attivita-modal.component';


@Component({
  selector: 'cm-programma-dettaglio',
  templateUrl: './programma-dettaglio.component.html',
  styleUrls: ['./programma-dettaglio.component.scss']
})
export class ProgrammaDettaglioComponent implements OnInit {
  @ViewChild('cmPagination') cmPagination: PaginationComponent;
  totalRecords: number = 0;
  pageSize: number = 10;
  idPiano: string;
  piano: PianoAlternanza;
  differenzaAnno: number;
  filtro;
  listaClassi = [];
  listaStudenti;
  tipologieAttivita;
  tabDefaultSelectedId;

  ricerca = {
    istitutoId:this.dataService.istitudeId,   
    attivita: {},
    competenze: []
  }

  navTitle: string = "Programma";
  breadcrumbItems = [
    {
      title: "Lista programmi",
      location: "../../incorso"
    },
    {
      title: "Dettaglio programma",
      location: "./"
    }
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private programmaService: ProgrammazioneService,
    private programmazioneService: ProgrammazioneService,
    private modalService: NgbModal) {
    this.filtro = {
      nome: '',
      annoCorso: '3',
      individuale: false,
      corsoStudioId: '',
      annoScolastico: '',
      tags: '',
      titolo: ''
    };
  }


  ngOnInit() {


    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['tab']) {
        this.tabDefaultSelectedId = "tab-" + queryParams['tab'];
      }

      this.route.params.subscribe(params => {
        this.idPiano = params['id'];

        this.dataService.getAttivitaTipologie().subscribe((res) => {
          this.tipologieAttivita = res;
          this.dataService.getPianoById(this.idPiano).subscribe((piano: PianoAlternanza) => {
            this.piano = piano;
            this.navTitle = piano.titolo + ' - ' + piano.corsoDiStudio;
            this.differenzaAnno = Math.abs(this.programmazioneService.getDifferenzaAnni(this.piano));
            if (queryParams['tab'] == 'studenti') {
              this.getStudentiPage(1);
            } else {
              this.getClassiPage(1);
            }
          },
            (err: any) => console.log(err),
            () => console.log('get piano by id'));
        },
          (err: any) => console.log(err),
          () => console.log('get tipologia'));

      });

    });
  }

  getClassi() {
    this.getClassiPage(1);
  }
  isValidYear(year: number) {
    if ((this.differenzaAnno + year) > 5)
      return false;
    return true;
  }

  getStudenti() {
    this.getStudentiPage(1);
  }
  pageClassiChanged(page: number) {
    this.getClassiPage(page);
  }
  pageStudentiChanged(page: number) {
    this.getStudentiPage(page);
  }
  getClassiPage(page: number) {
    this.filtro.annoScolastico = this.programmaService.getActualYear();
    this.filtro.corsoStudioId = this.piano.corsoDiStudioId;
    this.filtro.individuale = false;
    this.dataService.getAttivitaGiornaliere(this.filtro, (page - 1), this.pageSize).subscribe((res: any) => {
      this.totalRecords = res.totalElements
      this.listaClassi = res.content;
      
      // // set status on date.
      // var current = new Date();
      // res.content.forEach(function (classeAA) {
      //   let startAA = new Date(Number(classeAA.dataInizio));
      //   let endAA = new Date(Number(classeAA.dataFine));
      //   if (isAfter(current, startAA) && isBefore(current, endAA)) {
      //     classeAA.stato = 1;
      //   } else if (isSameDay(startAA, current) || isSameDay(endAA, current)) {
      //     classeAA.stato = 1;
      //   } else if (isAfter(current, endAA)) {
      //     classeAA.stato = 0;
      //   } else {
      //     classeAA.stato = -1;
      //   }
      // })

    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliere'));

  }
  getStudentiPage(page: number) {
    this.dataService.getStudentiReportByPianoPage(this.idPiano, (page - 1), this.pageSize, this.programmaService.getActualYear(), this.filtro.annoCorso, this.filtro.nome)
      .subscribe((response) => {
        this.totalRecords = response.results.totalElements;
        this.listaStudenti = response.results.content;
      },
        (err: any) => console.log(err),
        () => console.log('get studenti'));
  }
  getColorBar(programmate, totali) {
    if (programmate >= totali) {
      return 'success';
    }
    if (programmate >= totali / 2) {
      return 'warning';
    }
    if (programmate <= totali / 2) {
      return 'danger';
    }
  }
  onFilterCorsoChangeClasse(anno) {
    console.log('change filter');
    this.cmPagination.pages = [];
    this.cmPagination.changePage(1);
    this.pageClassiChanged(1);
  }
  onFilterCorsoChangeStudente(anno) {
    console.log('change filter');
    this.cmPagination.pages = [];
    this.cmPagination.changePage(1);
    this.pageStudentiChanged(1);
  }
  openDetailClasse(classe) {
    sessionStorage.setItem('programmazioneDettaglioClasse', JSON.stringify(classe));
    this.router.navigate(['classe/detail', classe.nome], { relativeTo: this.route });
  }

  openDetailStudente(studente) {
    sessionStorage.setItem('programmazioneDettaglioStudente', JSON.stringify(studente));
    this.router.navigate(['studente/detail', studente.idStudente], { relativeTo: this.route });
  }

  tabChanged($event) {
    if ($event.nextId == "tab-classi") {
      this.getClassi();
    } else if ($event.nextId == "tab-studenti") {
      this.getStudenti();
    }
  }

  getTipologia(id) {
    if (this.tipologieAttivita) {
      return this.tipologieAttivita.find(tipologia => tipologia.id == id).titolo;
    }
  }

  searchClassAA() {
    this.getClassi();
  }

  openSearch() {
    sessionStorage.setItem('searchActivitiesOptions', JSON.stringify(this.ricerca));
    this.router.navigate(['classe/search/', this.filtro.annoCorso, 'gruppo'], { relativeTo: this.route });

  }

  openConfirmDelete(attivita) {
    const modalRef = this.modalService.open(ProgrammaCancellaAttivitaModal, { size: "lg" });
    modalRef.componentInstance.attivita = attivita;
    modalRef.componentInstance.type = "l'attivita programmata";
    modalRef.componentInstance.titolo = 'attivita';
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        this.dataService.deleteAttivitaFromProgramma(attivita.id).subscribe(
          (response: boolean) => {
            if (response) {
              this.getClassi();
            } else {
              console.log('not deleted');
              alert("Errore nella cancellazione");
            }
          },
          (err: any) => console.log(err),
          () => console.log('delete attivita from piano')
        );
      }
    });
  }

  openModifica(attivita) {
    this.router.navigate(['modifica/gruppoAttivita/', attivita.id], { relativeTo: this.route });
  }

  openDetail(attivita) {
    this.router.navigate(['detail/gruppoAttivita/', attivita.id], { relativeTo: this.route });
  }

  openGestioneGruppo(attivita) {
    this.router.navigate(['gestione/gruppoAttivita/', attivita.id], { relativeTo: this.route });
  }

}
