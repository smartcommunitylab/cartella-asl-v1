import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/data.service';
import { ProgrammazioneService } from '../../../core/services/programmazione.service';
import { GeoService } from '../../../core/services/geo.service';

@Component({
  selector: 'cm-search-attivita',
  templateUrl: './search-attivita-container.component.html',
  styleUrls: ['./search-attivita-container.component.css']
})
export class SearchAttivitaContainer implements OnInit {
  classe;
  studente;
  classeSearch: boolean = false;
  studenteSearch: boolean = false;
  idPiano: string;
  navTitle: string = "Ricerca attivita";
  breadcrumbItems = [
    {
      title: "Lista eccezioni",
      location: "../"
    },
    {
      title: "Ricerca",
      location: "./"
    }
  ];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private programmazioneService: ProgrammazioneService,
    private modalService: NgbModal,
    private geoService: GeoService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      /*if (params['classe']) {
        this.classe = JSON.parse(params['classe']);
      }
      if (params['studente']) {
        this.studente = JSON.parse(params['studente']);
      }
      if (params['id']) {
        this.idPiano = params['id'];
      }
      this.manageNavBar();*/
    });

  }

  manageNavBar() {
    for (let i = 0; i < this.route.snapshot.url.length; i++) {
      if (this.route.snapshot.url[i].path === "studente") {
        this.breadcrumbItems[2].title = this.breadcrumbItems[2].title + "studente";
        this.studenteSearch = true;
        break;
      }
      if (this.route.snapshot.url[i].path === "classe") {
        this.breadcrumbItems[2].title = this.breadcrumbItems[2].title + "classe";
        this.classeSearch = true;
        break;
      }
    }
  }
  
  addOpportunita(opportunita){
    sessionStorage.setItem('competenze', JSON.stringify(opportunita.competenze));
    sessionStorage.setItem('opportunita', JSON.stringify(opportunita));
    this.router.navigate(['../create-eccezione',opportunita.id], { relativeTo: this.route });
  }

  createAttivitaForClasse() {
    return {
      annoScolastico:this.programmazioneService.getActualYear()
    }
  }
  createAttivitaForStudente() {
    return {
      annoScolastico:this.programmazioneService.getActualYear()
    }
  }
}

