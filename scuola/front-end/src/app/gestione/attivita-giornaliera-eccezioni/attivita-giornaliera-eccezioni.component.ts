import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'cm-attivita-giornaliera-eccezioni',
  templateUrl: './attivita-giornaliera-eccezioni.component.html',
  styleUrls: ['./attivita-giornaliera-eccezioni.component.scss']
})
export class AttivitaGiornalieraEccezioniComponent implements OnInit {



  filtro = {
    tipologia: "",
    anno: "",
    corsodistudio: "",
    dataInizio: 0,
    dataFine: 0
  };
  dataInizio;
  dataFine;

  filterDatePickerConfig = {
    locale: 'it',
    firstDayOfWeek: 'mo'
  };

  tipologieAttivita;
  corsiDiStudio;

  eccezioni;
  totalRecords;
  selectedEccezione;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.restoreURLState();
    this.loadFiltersData();
    this.filtra();
  }

  filtra() {
    this.filtro.dataInizio =  moment(this.dataInizio, 'DD-MMM-YYYY').valueOf();
    this.filtro.dataFine = moment(this.dataFine, 'DD-MMM-YYYY').valueOf();
    this.dataService.getAttivitaGiornaliereEccezioni(this.filtro).subscribe((res: any) => {
      this.eccezioni = this.groupEccezioni(res);
      this.totalRecords = res.length;
      console.log(this.eccezioni);
    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliere eccezioni'));
    this.recreateFilterUrl();
  }

  recreateFilterUrl() {
    let queryParams: any = {};
    if (this.filtro.tipologia) {
      queryParams.tipologia = this.filtro.tipologia;
    }
    if (this.filtro.anno) {
      queryParams.anno = this.filtro.anno;
    }
    if (this.filtro.corsodistudio) {
      queryParams.corsodistudio = this.filtro.corsodistudio;
    }
    if (this.filtro.dataInizio) {
      queryParams.dataInizio = this.filtro.dataInizio;
    }
    if (this.filtro.dataFine) {
      queryParams.dataFine = this.filtro.dataFine;
    }
    const url = this.router
      .createUrlTree([], { relativeTo: this.route, queryParams: queryParams })
      .toString();
    this.location.go(url);
  }

  getTipologia(id) {
    if (this.tipologieAttivita) {
      return this.tipologieAttivita.find(tipologia => tipologia.id == id).titolo;
    }
  }
  restoreURLState() {
    this.filtro.tipologia = this.route.snapshot.queryParamMap.get('tipologia');
    this.filtro.anno = this.route.snapshot.queryParamMap.get('anno');
    this.filtro.corsodistudio = this.route.snapshot.queryParamMap.get('corsodistudio');
    this.filtro.dataInizio = +this.route.snapshot.queryParamMap.get('dataInizio');
    this.filtro.dataFine = +this.route.snapshot.queryParamMap.get('dataFine');
  }

  loadFiltersData() {
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologieAttivita = res;
    });
    this.dataService.getCorsiStudio().subscribe((res) => {
      this.corsiDiStudio = res;
      console.log(this.corsiDiStudio);
    });
  }
  groupEccezioni(eccezioni: any): any {
    var tmpArray = [];
    
    for (var i = 0; i < eccezioni.length; i++) {
      //different corso di studio
      for (var key in eccezioni[i].eccezioni) {
        //in every eccezione
        eccezioni[i].eccezioni[key].corsoDiStudio = eccezioni[i].corsoDiStudio;
        eccezioni[i].eccezioni[key].corsoDiStudioId = eccezioni[i].corsoDiStudioId;
        tmpArray.push(eccezioni[i].eccezioni[key]);
      }
      //   var tmpArray=[];
      //   for (var key in eccezioni[i]) {
      //     eccezioni[i].eccezioni[key].dettagli.map(studente => tmpArray.push(studente));
      //   };
      //   eccezioni[i].dettagliEccezione.convertedArray=tmpArray;

      // }
    }
    return tmpArray;
    
  }
}
