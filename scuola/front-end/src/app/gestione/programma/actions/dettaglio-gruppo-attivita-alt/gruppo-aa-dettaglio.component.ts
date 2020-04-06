import { Component } from '@angular/core';

import { DataService } from '../../../../core/services/data.service'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { GrowlerService, GrowlerMessageType } from '../../../../core/growler/growler.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from "moment";
import { Moment } from 'moment';
import { CompetenzaDetailModalComponent } from '../../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { ProgrammaCancellaAttivitaModal } from '../cancella-attivita-modal/programma-cancella-attivita-modal.component';
import { isBefore, isSameDay, isAfter } from 'date-fns';

@Component({
  selector: 'dettaglio-gruppo-aa',
  templateUrl: './gruppo-aa-dettaglio.html',
  styleUrls: ['./gruppo-aa-dettaglio.scss']

})
export class GruppoDettaglioAttivitaAlt implements OnInit {

  attivitaAltGruppo;
  forceErrorDisplay: boolean = false;
  dataInizio: Moment;
  dataFine: Moment;

  datePickerConfig = {
    locale: 'it',
    firstDayOfWeek: 'mo'
  };
  timePickerConfig = {
    locale: 'it',
    format: 'H:mm',
    hours24Format: 'H',
    showTwentyFourHours: true
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService,
  ) { }

  navTitle: string = "Dettaglio attivita";
  breadcrumbItems = [
    {
      title: "List gruppo attivita'",
      location: "../../../",
      queryParams: { 'tab': 'classi' }
    },
    {
      title: "Modifica attivita'",
      location: "./"
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.dataService.getAttivitaAlternanzaByIdAPI(id)
          .subscribe((activity) => {
            this.attivitaAltGruppo = activity;
            this.initUI();
          },
            (err: any) => console.log(err),
            () => console.log('get attivita alternanza by id'));
      }
    });
  }


  modifica() {
    this.attivitaAltGruppo.dataInizio = this.dataInizio.toDate().getTime();
    this.attivitaAltGruppo.dataFine = this.dataFine.toDate().getTime();
    if (this.allValidated()) { //submission.
      this.dataService.updateAttivitaAlternanzaById(this.attivitaAltGruppo.id, this.attivitaAltGruppo)
        .subscribe((activity: any) => {
          this.router.navigate(['../../../'], { relativeTo: this.route, queryParams: { tab: 'classi' } });
        },
          (err: any) => console.log(err),
          () => console.log('error updating attivitaAlternanza'));
    } else {
      //probably never used: allValidated decides disabled status of save
      this.forceErrorDisplay = true;
      this.growler.growl('Compila i campi necessari', GrowlerMessageType.Warning);
    }

  }

  cancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route, queryParams: { tab: 'classi' } });
  }

  initUI() {
    this.dataInizio = moment.unix(this.attivitaAltGruppo.dataInizio / 1000);
    this.dataFine = moment.unix(this.attivitaAltGruppo.dataFine / 1000);

    // set status on date.
    // var current = new Date();
    // let startAA = new Date(Number(this.attivitaAltGruppo.dataInizio));
    // let endAA = new Date(Number(this.attivitaAltGruppo.dataFine));
    // if (isAfter(current, startAA) && isBefore(current, endAA)) {
    //   this.attivitaAltGruppo.stato = 1;
    // } else if (isSameDay(startAA, current) || isSameDay(endAA, current)) {
    //   this.attivitaAltGruppo.stato = 1;
    // } else if (isAfter(current, endAA)) {
    //   this.attivitaAltGruppo.stato = 0;
    // } else {
    //   this.attivitaAltGruppo.stato = -1;
    // }

  }

  allValidated() {
    return this.attivitaAltGruppo.titolo && this.dataInizio && this.dataFine &&
      this.dataInizio <= this.dataFine;
  }

  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }

  deleteAttivita() {
    const modalRef = this.modalService.open(ProgrammaCancellaAttivitaModal, { size: "lg" });
    modalRef.componentInstance.attivita = this.attivitaAltGruppo;
    modalRef.componentInstance.type = "l'attivita programmata";
    modalRef.componentInstance.titolo = 'attivita';
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        this.dataService.deleteAttivitaFromProgramma(this.attivitaAltGruppo.id).subscribe(
          (response: boolean) => {
            if (response) {
              this.router.navigate(['../../../'], { relativeTo: this.route, queryParams: { tab: 'classi' } });
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
  

  addCompetenze() {
    this.router.navigate(['./skills'], { relativeTo: this.route });
  }
  
  deleteCompetenza(deleted, $event) {
    if ($event) $event.stopPropagation();

    const modalRef = this.modalService.open(ProgrammaCancellaAttivitaModal);
    modalRef.componentInstance.type = "la competenza";
    modalRef.componentInstance.titolo = "competenza";
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        let updatedCompetenze = [];
        for (let competenza of this.attivitaAltGruppo.competenze) {
          if (competenza.id != deleted.id) {
            updatedCompetenze.push(Number(competenza.id));
          }
        }

        this.attivitaAltGruppo.competenzeId = updatedCompetenze;
        this.dataService.updateAttivitaAlternanzaById(this.attivitaAltGruppo.id, this.attivitaAltGruppo)
          .subscribe((activity: any) => {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.dataService.getAttivitaAlternanzaByIdAPI(this.attivitaAltGruppo.id)
              .subscribe((activity) => {
                this.attivitaAltGruppo = activity;
                this.initUI();
              },
                (err: any) => console.log(err),
                () => console.log('get attivita alternanza by id'));
          },
            (err: any) => console.log(err),
            () => console.log('error updating attivitaAlternanza'));

      }
    });
  }

  editAttivita() {
    this.router.navigate(['../../../modifica/gruppoAttivita', this.attivitaAltGruppo.id], { relativeTo: this.route });
  }

}