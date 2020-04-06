import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { GeoService } from '../../../../core/services/geo.service';
import { ProgrammazioneService } from '../../../../core/services/programmazione.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PianoAlternanza } from '../../../../shared/classes/PianoAlternanza.class';
import { Competenza } from '../../../../shared/classes/Competenza.class';
import { Attivita } from '../../../../shared/classes/Attivita.class';
import { AttivitaPiano } from '../../../../shared/classes/AttivitaPiano.class';
import { ProgrammaOpenAttivitaModal } from '../dettaglio-attivita-modal/dettaglio-attivita-modal.component';
import { ProgrammaAddAttivitaModal } from '../dettaglio-attivita-add/dettaglio-attivita-add.component';
import { ProgrammaOpenCompetenzaModal } from '../dettaglio-competenza-modal/dettaglio-competenza-modal.component';
@Component({
  selector: 'cm-search-attivita',
  templateUrl: './search-attivita-container.component.html',
  styleUrls: ['./search-attivita-container.component.css']
})
export class SearchAttivitaContainer implements OnInit {

  classe;
  studente;
  annoCorso;
  classeSearch: boolean = false;
  studenteSearch: boolean = false;
  idPiano: string;
  navTitle: string = "Ricerca attivita";
  breadcrumbItems = [
    {
      title: "Lista programmi",
      location: "../../../../../incorso",
      queryParams: {}
    },
    {
      title: "Dettaglio programma",
      location: "../../../../../",
      queryParams: {}
    },
    {
      title: "Dettaglio ",
      location: "../../",
      queryParams: {}
    },
    {
      title: "Ricerca",
      location: "./",
      queryParams: {}
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
      if (params['classeNome']) {
        this.classe = params['classeNome'];
      }
      if (params['studenteId']) {
        this.studente = params['studenteId'];
      }
      if (params['annoCorso']) {
        this.annoCorso = params['annoCorso'];
      }
      if (params['id']) {
        this.idPiano = params['id'];
      }
      this.manageNavBar();
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
        this.breadcrumbItems[2].location = '../../../';
        this.breadcrumbItems[2].queryParams['tab'] = 'classi';
        this.classeSearch = true;
        break;
      }
    }
  }

  addOpportunita(opportunita) {
    if (this.classeSearch) {
      this.dataService.addOpportunitaToGruppo(this.idPiano, opportunita, this.annoCorso, this.programmazioneService.getActualYear(), opportunita.competenze).subscribe(
        (response: boolean) => {
          if (response) {
            //addded
            //go to list of class activity
            this.router.navigate(['gestione/programma/detail/', this.idPiano], { queryParams: { tab: 'classi' } });
          } else {
            console.log('not added');
            alert("Errore nell'aggiunta");
          }

        },
        (err: any) => console.log(err),
        () => console.log('add opportunita from piano')
      );
    } else {
      this.dataService.addOpportunitaToStudente(this.idPiano, opportunita, this.studente, this.annoCorso, this.programmazioneService.getActualYear(), opportunita.competenze).subscribe(
        (response: boolean) => {
          if (response) {
            //addded
            //go to detail of studente
            this.router.navigate(['../..'], { relativeTo: this.route });

          } else {
            console.log('not added');
            alert("Errore nell'aggiunta");
          }

        },
        (err: any) => console.log(err),
        () => console.log('add opportunita from piano')
      );
    }
  }

  createAttivitaForClasse() {
    return {
      annoScolastico: this.programmazioneService.getActualYear()
    }
  }
  createAttivitaForStudente() {
    return {
      annoScolastico: this.programmazioneService.getActualYear()
    }
  }
}

