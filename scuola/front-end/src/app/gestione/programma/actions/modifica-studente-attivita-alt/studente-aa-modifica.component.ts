import { Component } from '@angular/core';

import { DataService } from '../../../../core/services/data.service'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { GrowlerService, GrowlerMessageType } from '../../../../core/growler/growler.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from "moment";
import { Moment } from 'moment';
import { CompetenzaDetailModalComponent } from '../../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';

@Component({
  selector: 'modifica-studente-aa',
  templateUrl: './studente-aa-modifica.html',
  styleUrls: ['./studente-aa-modifica.scss']

})
export class StudenteModificaAttivitaAlt implements OnInit {

  attivitaAltStudente;
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

  navTitle: string = "Modifica attivita";
  breadcrumbItems = [
    {
      title: "List studente attivita'",
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
            this.attivitaAltStudente
              = activity;
            this.initUI();
          },
            (err: any) => console.log(err),
            () => console.log('get attivita alternanza by id'));
      }
    });
  }


  modifica() {
    this.attivitaAltStudente
      .dataInizio = this.dataInizio.toDate().getTime();
    this.attivitaAltStudente
      .dataFine = this.dataFine.toDate().getTime();
    let studentIds = [];
    this.attivitaAltStudente
      .studenti.forEach(element => {
        studentIds.push(element.id);
      });
    this.attivitaAltStudente
      .studentiId = studentIds;
    if (this.allValidated()) { //submission.
      this.dataService.updateAttivitaAlternanzaById(this.attivitaAltStudente
        .id, this.attivitaAltStudente
      )
        .subscribe((activity: any) => {
          this.router.navigate(['../../../'], { relativeTo: this.route });
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
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  initUI() {

    this.dataInizio = moment.unix(this.attivitaAltStudente
      .dataInizio / 1000);
    this.dataFine = moment.unix(this.attivitaAltStudente
      .dataFine / 1000);

  }

  allValidated() {
    return this.dataInizio && this.dataFine &&
      this.dataInizio <= this.dataFine;
  }

  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }

}