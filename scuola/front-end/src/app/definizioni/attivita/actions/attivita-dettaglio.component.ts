import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import { AttivitaCancellaModal } from './attivita-cancella-modal.component';
import { Location } from '@angular/common';
import { Competenza } from '../../../shared/classes/Competenza.class';
import { CompetenzaDetailModalComponent } from '../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { TipologiaInterno } from '../../../shared/classes/TipologiaInterna.class';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'attivita-dettaglio',
  templateUrl: './attivita-dettaglio.html',
  styleUrls: ['./attivita-dettaglio.scss']
})
export class AttivitaDettaglio {
  closeResult: string;
  attivita: Attivita;
  tipologie: TipologiaInterno[];
  map;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService,
    private location: Location) { }


  navTitle: string = "Dettaglio attività";
  breadcrumbItems = [
    {
      title: "Attività interne",
      location: "../../"
    },
    {
      title: "Dettaglio attività",
      location: "./"
    }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getData("tipologiaInterna").subscribe(tipologie => {
        this.tipologie = tipologie;
        this.dataService.getAttivitaById(id).subscribe((attivita: Attivita) => {
          this.attivita = attivita;
          this.navTitle = attivita.titolo;

          setTimeout(() => { //ensure that map div is rendered
            this.drawMap();
          }, 0);
          
        }, (err: any) => console.log(err), () => console.log('get attivita'));
      },
        (err: any) => console.log(err),
        () => console.log('get tipologie attivita'));
    });
  }

  back() {
    this.location.back();
  }

  deleteAttivita() {
    const modalRef = this.modalService.open(AttivitaCancellaModal);
    modalRef.componentInstance.type = "l'attivita";
    modalRef.componentInstance.title = "attivita";
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        this.dataService.deleteCorsoInterno(this.attivita.id).subscribe(
          (response: boolean) => {
            if (response) {
              this.growler.growl('Successo.', GrowlerMessageType.Success);
              this.router.navigate(['../../incorso'], { relativeTo: this.route });
            } else {
              this.growler.growl("Errore", GrowlerMessageType.Danger);
            }

          },
          (err: any) => console.log(err),
          () => console.log('delete attivita')
        );

      }
    });
  }

  editAttivita() {
    this.router.navigate(['../../edit', this.attivita.id], { relativeTo: this.route });
  }

  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }

  addCompetenze() {
    this.router.navigate(['./skills'], { relativeTo: this.route });
  }

  deleteCompetenza(deleted, $event) {
    if ($event) $event.stopPropagation();

    const modalRef = this.modalService.open(AttivitaCancellaModal);
    modalRef.componentInstance.type = "la competenza";
    modalRef.componentInstance.title = "competenza";
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        let updatedCompetenze = [];
        for (let competenza of this.attivita.competenze) {
          if (competenza.id != deleted.id) {
            updatedCompetenze.push(Number(competenza.id));
          }
        }
        this.dataService.updateCompetenze(this.attivita.id, updatedCompetenze)
          .subscribe((updatedComptenze: boolean) => {
            if (updatedComptenze) {
              this.growler.growl('Successo.', GrowlerMessageType.Success);
              this.dataService.getAttivitaById(this.attivita.id)
                .subscribe((attiv: Attivita) => {
                  this.attivita = attiv;
                });
            } else {
              this.growler.growl("Errore", GrowlerMessageType.Danger);
            }
          })
      }
    });
  }

  getTipologiaAttivita(tipoId: any) {
    for (let tipo of this.tipologie) {
      if (tipo.id == tipoId) {
        return tipo.titolo;
      }
    }
  }
  drawMap(): void {
    this.map = Leaflet.map('map');
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    if (this.attivita.coordinate) {
      let selectedLocationMarker = Leaflet.marker([this.attivita.coordinate.latitude, this.attivita.coordinate.longitude]).addTo(this.map);
      this.map.setView(selectedLocationMarker.getLatLng(), 14);
    }
    
  }

}

