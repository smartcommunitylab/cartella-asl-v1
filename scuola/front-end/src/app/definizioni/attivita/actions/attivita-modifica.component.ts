import { Component, Input } from '@angular/core';

import { DataService } from '../../../core/services/data.service'
import { Attivita } from '../../../shared/classes/Attivita.class';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Richiesta } from '../../../shared/classes/Richiesta.class';
import * as moment from "moment";
import { Moment } from 'moment';
import { Competenza } from '../../../shared/classes/Competenza.class';
import { CompetenzaDetailModalComponent } from '../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { config } from '../../../config';
import { GeoService } from '../../../core/services/geo.service';
import * as Leaflet from 'leaflet';
import { NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'attivita-modifica',
  templateUrl: './attivita-modifica.html',
  styleUrls: ['./attivita-modifica.scss']

})
export class AttivitaModifica implements OnInit {

  attivita: Attivita;
  richiesta: Richiesta;
  competenze: Competenza[];
  tipologie;
  corsiDiStudio;

  titolo: string;
  dataInizio: Moment;
  dataFine: Moment;
  oraInizio: NgbTimeStruct;
  oraFine: NgbTimeStruct;
  minuteStep: number = 5;

  isNewActivity:boolean = false;
  forceErrorDisplay:boolean = false;


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
  map;
  selectedLocationMarker;
  indirizzo;


  addressesItems = [];
  showAddressesList;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService,
    private GeoService: GeoService
  ) { }

  navTitle: string = "Modifica attività";
  breadcrumbItems = [
    {
      title: "Attività interne",
      location: "../../"
    },
    {
      title: "Modifica attività",
      location: "./"
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getData("tipologiaInterna").subscribe(tipologie => {
        this.tipologie = tipologie;
        this.dataService.getCorsoDiStudioByInstituteSchoolYear(this.dataService.istitudeId, config.schoolYear).subscribe(corsi => {
          this.corsiDiStudio = corsi;
          if (id) {
            this.dataService.getAttivitaById(id).subscribe((attivita: Attivita) => {
              this.attivita = attivita;
              this.initUI();
            },
              (err: any) => console.log(err),
              () => console.log('get attivita'));

          } else {
            this.initUI();
          }
        },
          (err: any) => console.log(err),
          () => console.log('no corsi for istituto defined'));

      },
        (err: any) => console.log(err),
        () => console.log('no tipolgie defined'));
    });
 
  }

  modifica() {

    this.attivita.dataInizio = this.dataInizio.toDate().getTime();
    this.attivita.dataFine = this.dataFine.toDate().getTime();
    if (this.attivita.corsoId) {
      this.attivita.corso = this.getCorsoTitle(this.attivita.corsoId);
    }

    if (this.attivita.coordinate && !this.attivita.coordinate.latitude) { //if latitude field is not present means that position is edited
      this.attivita.coordinate = {
        'latitude': this.attivita.coordinate[0],
        'longitude': this.attivita.coordinate[1]
      };
    }


    if (this.oraInizio) {
        this.attivita.oraInizio = this.formatTwoDigit(this.oraInizio.hour) + ":" + this.formatTwoDigit(this.oraInizio.minute);
    }
    if (this.oraFine) {
        this.attivita.oraFine = this.formatTwoDigit(this.oraFine.hour) + ":" + this.formatTwoDigit(this.oraFine.minute);
    }

    if (this.allValidated()) { //submission.

      if (this.isNewActivity) {
        this.attivita.istitutoId = this.dataService.istitudeId;
        this.attivita.istituto = this.dataService.istituto;
        this.dataService.addCorsoInterno(this.attivita).subscribe((inserted: Attivita) => {
          if (inserted) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['definizioni/attivita/detail', inserted.id]);
          } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          }
        });
      } else {
        this.dataService.updateCorsoInterno(this.attivita).subscribe((updated: boolean) => {
          if (updated) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['definizioni/attivita/detail', this.attivita.id]);
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

  formatTwoDigit(n) {
    return (n < 10 ? '0' : '') + n;
  }
  

  getCorsoTitle(id) {
    for (let corso of this.corsiDiStudio) {
      if (corso.courseId === id) {
        return corso.nome;
      }
    }
    return null;
  }

  formatTime(time: Moment) {
    let timeStr = (time.toDate().getHours() < 10 ? '0' : '') + time.toDate().getHours() + ":" + (time.toDate().getMinutes() < 10 ? '0' : '') + time.toDate().getMinutes();
    return timeStr;
  }

  cancel() {
    if (this.isNewActivity) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../detail', this.attivita.id], { relativeTo: this.route });
    }
  }

  initUI() {
    if (this.attivita) {
      this.titolo = "Modifica";
      this.dataInizio = moment.unix(this.attivita.dataInizio / 1000);
      this.dataFine = moment.unix(this.attivita.dataFine / 1000);
      if (this.attivita.oraInizio) {
        let oraInizoHoursMins = this.attivita.oraInizio.split(':');
        this.oraInizio = {
          hour: Number(oraInizoHoursMins[0]),
          minute: Number(oraInizoHoursMins[1]),
          second: 0
        };
        /*if (oraInizoHoursMins.length == 2) {
          var startTime = new Date(this.attivita.dataInizio);
          startTime.setHours(Number(oraInizoHoursMins[0]));//hour
          startTime.setMinutes(Number(oraInizoHoursMins[1]));//min
          this.oraInizio = moment.unix(startTime.getTime() / 1000);
        }*/
      }
      if (this.attivita.oraFine) {
        let oraFineHoursMins = this.attivita.oraFine.split(':');
        this.oraFine = {
          hour: Number(oraFineHoursMins[0]),
          minute: Number(oraFineHoursMins[1]),
          second: 0
        };
        /*if (oraFineHoursMins.length == 2) {
          var endTime = new Date(this.attivita.dataFine);
          endTime.setHours(Number(oraFineHoursMins[0])); //hour
          endTime.setMinutes(Number(oraFineHoursMins[1])); //min
          this.oraFine = moment.unix(endTime.getTime() / 1000);
        }*/
      }
      
     
      this.navTitle = this.attivita.titolo;
    } else {
      this.isNewActivity = true;
      this.titolo = "Crea";
      this.attivita = new Attivita();
      this.attivita.coordinate = this.dataService.getIstitutoPosition();
      this.dataInizio = moment();
      this.dataFine = moment();
      this.breadcrumbItems[1].title = "Crea attività";
      this.navTitle = "Crea attività";
    }
    if (this.richiesta) {
      this.attivita.titolo = this.richiesta.titolo;
      this.attivita.descrizione = this.richiesta.descrizione;
    }
    setTimeout(() => { //ensure that map div is rendered
      this.drawMap();
    }, 0);
  }

  addCompetenze() {


  }

  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }

  allValidated() {
    return this.dataInizio && this.dataFine &&    
      this.dataInizio <= this.dataFine &&
      this.attivita.titolo && this.attivita.corsoId &&
      this.attivita.tipologia && this.attivita.ore;
  }



  drawMap(): void {
    this.map = Leaflet.map('map',  {
      center: [46.1025748,10.927261],
      zoom: 8
    });
    
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    /*if (this.selectedLocationMarker) {
      this.selectedLocationMarker.addTo(map);
    }*/

    if (this.attivita.coordinate) {
      this.selectedLocationMarker = Leaflet.marker([this.attivita.coordinate.latitude, this.attivita.coordinate.longitude]).addTo(this.map);
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
        this.attivita.coordinate = [e.latlng.lat, e.latlng.lng];
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
    this.attivita.coordinate = [item.location[0], item.location[1]];
    this.indirizzo = item.name;
    if (!this.selectedLocationMarker) {
      this.selectedLocationMarker = Leaflet.marker(this.attivita.coordinate).addTo(this.map);
    } else {
      this.selectedLocationMarker.setLatLng(this.attivita.coordinate).update();
    }
    this.map.setView(this.selectedLocationMarker.getLatLng());
    
    this.showAddressesList = false;
  }
}