import { Component, Input } from '@angular/core';
import { DataService } from '../../../core/services/data.service'
import { Azienda } from '../../../shared/interfaces'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GeoService } from '../../../core/services/geo.service';
import * as Leaflet from 'leaflet';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'azienda-modifica',
  templateUrl: './azienda-modifica.html',
  styleUrls: ['./azienda-modifica.scss']

})
export class AziendaModifica implements OnInit {

  azienda: Azienda;
  titolo: string;
  isNewAzienda: boolean = false;
  forceErrorDisplay: boolean = false;
  map;
  selectedLocationMarker;
  indirizzo;
  addressesItems = [];
  showAddressesList;

  tipoAzienda = [{ "id": 1, "value": "Associazione" }, { "id": 5, "value": "Cooperativa" }, { "id": 10, "value": "Impresa" }, { "id": 15, "value": "Libero professionista" }, { "id": 20, "value": "Pubblica amministrazione" }, { "id": 25, "value": "Ente privato/Fondazione" }];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private growler: GrowlerService,
    private GeoService: GeoService
  ) { }

  navTitle: string = "Modifica azienda";
  breadcrumbItems = [
    {
      title: "Azienda",
      location: "../../"
    },
    {
      title: "Modifica azienda",
      location: "./"
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.dataService.getAzienda(id).subscribe((az: Azienda) => {
          this.azienda = az;
          this.initUI();
        },
          (err: any) => console.log(err),
          () => console.log('get azienda'));

      } else {
        this.initUI();
      }
    },
      (err: any) => console.log(err),
      () => console.log('no corsi for istituto defined'));

  }

  modifica() {
    if (this.azienda.coordinate && !this.azienda.coordinate.latitude) { //if latitude field is not present means that position is edited
      this.azienda.coordinate = {
        'latitude': this.azienda.coordinate[0],
        'longitude': this.azienda.coordinate[1]
      };
    }

    if (this.allValidated()) { //submission.

      if (this.isNewAzienda) {
        this.dataService.addAzienda(this.azienda).subscribe((inserted: Azienda) => {
          if (inserted) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['../../'], { relativeTo: this.route });
          } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          }
        });
      } else {
        this.dataService.updateAzienda(this.azienda).subscribe((updated: boolean) => {
          if (updated) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['../../'], { relativeTo: this.route });
          } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          }
        });
      }
    } else {
      //probably never used: allValidated decides disabled status of save
      this.forceErrorDisplay = true;
      this.growler.growl('Compila i campi necessari', GrowlerMessageType.Warning);
    }

  }

  cancel() {
    if (this.isNewAzienda) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../details', this.azienda.id], { relativeTo: this.route });
    }
  }

  initUI() {
    if (this.azienda) {
      this.titolo = "Modifica";
    }
    else {
      this.isNewAzienda = true;
      this.titolo = "Crea";
      this.azienda = new Azienda();
      this.azienda.coordinate = this.dataService.getIstitutoPosition();
      this.azienda.origin = 'CONSOLE';
      this.breadcrumbItems[1].title = "Crea azienda";
      this.navTitle = "Crea azienda";
    }

    setTimeout(() => { //ensure that map div is rendered
      this.drawMap();
    }, 0);
  }

  allValidated() {
    return this.azienda.nome && this.azienda.partita_iva && (this.azienda.idTipoAzienda > 0);
  }

  drawMap(): void {
    this.map = Leaflet.map('map', {
      center: [46.1025748, 10.927261],
      zoom: 8
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    /*if (this.selectedLocationMarker) {
      this.selectedLocationMarker.addTo(map);
    }*/

    if ( !isNullOrUndefined(this.azienda.coordinate.latitude) && !isNullOrUndefined(this.azienda.coordinate.latitude)) {
      this.selectedLocationMarker = Leaflet.marker([this.azienda.coordinate.latitude, this.azienda.coordinate.longitude]).addTo(this.map);
      this.map.setView(this.selectedLocationMarker.getLatLng(), 14);
    } else {
      this.map.locate({ setView: true });
    }

    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      Leaflet.marker(e.latlng).addTo(this.map);
      Leaflet.circle(e.latlng, radius).addTo(this.map);
      this.map.setZoom(12);
    }

    this.map.addEventListener('click', (e) => {
      this.GeoService.getAddressFromCoordinates(e).then(location => {
        this.azienda.coordinate = [e.latlng.lat, e.latlng.lng];
        this.indirizzo = location;

        if (!this.selectedLocationMarker) {
          this.selectedLocationMarker = Leaflet.marker(e.latlng).addTo(this.map);
        } else {
          this.selectedLocationMarker.setLatLng(e.latlng).update();
        }
        this.map.setView(this.selectedLocationMarker.getLatLng());
      });
    });
  }

  getItems(ev: any) {
    this.GeoService.getAddressFromString(ev.target.value).then(locations => {
      let val = ev.target.value;
      if (locations instanceof Array) {
        this.addressesItems = locations;
      }
      if (val && val.trim() != '') {
        this.addressesItems = this.addressesItems.filter((item) => {
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
        this.showAddressesList = true;
      } else {
        this.showAddressesList = false;
      }
    });
  }

  selectPlace(item) {
    this.azienda.coordinate = [item.location[0], item.location[1]];
    this.indirizzo = item.name;
    if (!this.selectedLocationMarker) {
      this.selectedLocationMarker = Leaflet.marker(this.azienda.coordinate).addTo(this.map);
    } else {
      this.selectedLocationMarker.setLatLng(this.dataService.getIstitutoPosition()).update();
    }
    this.map.setView(this.selectedLocationMarker.getLatLng());

    this.showAddressesList = false;
  }

}