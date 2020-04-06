import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import { AziendaCancellaModal } from './azienda-cancella-modal.component';
import { Location } from '@angular/common';
import * as Leaflet from 'leaflet';
import { Azienda } from '../../../shared/interfaces';

@Component({
  selector: 'azienda-dettaglio',
  templateUrl: './azienda-dettaglio.html',
  styleUrls: ['./azienda-dettaglio.scss']
})
export class AziendaDettaglio {
  closeResult: string;
  azienda: Azienda;
  map;
  tipoAzienda = [{ "id": 1, "value": "Associazione" }, { "id": 5, "value": "Cooperativa" }, { "id": 10, "value": "Impresa" }, { "id": 15, "value": "Libero professionista" }, { "id": 20, "value": "Pubblica amministrazione" }, { "id": 25, "value": "Ente privato/Fondazione" }];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService,
    private location: Location) { }


  navTitle: string = "Dettaglio azienda";
  breadcrumbItems = [
    {
      title: "Azienda",
      location: "../../"
    },
    {
      title: "Dettaglio azienda",
      location: "./"
    }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getAzienda(id).subscribe((az: Azienda) => {
        this.azienda = az;
        this.navTitle = az.nome;
        setTimeout(() => { //ensure that map div is rendered
          this.drawMap();
        }, 0);

      }, (err: any) => console.log(err), () => console.log('get attivita'));
    });
  }

  back() {
    this.location.back();
  }

  deleteAzienda() {
    const modalRef = this.modalService.open(AziendaCancellaModal);
    modalRef.componentInstance.type = "l'azienda";
    modalRef.componentInstance.title = "azienda";
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        this.dataService.deleteAzienda(this.azienda.id).subscribe(
          (response: boolean) => {
            if (response) {
              this.growler.growl('Successo.', GrowlerMessageType.Success);
              this.router.navigate(['../../'], { relativeTo: this.route });
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

  editAzienda() {
    this.router.navigate(['../../edit', this.azienda.id], { relativeTo: this.route });
  }

  drawMap(): void {
    this.map = Leaflet.map('map');
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    if (this.azienda.coordinate) {
      let selectedLocationMarker = Leaflet.marker([this.azienda.coordinate.latitude, this.azienda.coordinate.longitude]).addTo(this.map);
      this.map.setView(selectedLocationMarker.getLatLng(), 14);
    }

  }

  getAziendaTipo(tipoId: any) {
    for (let tipo of this.tipoAzienda) {
      if (tipo.id == tipoId) {
        return tipo.value;
      }
    }
  }

}

