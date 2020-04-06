import { Component, OnInit } from '@angular/core';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import * as moment from 'moment';

@Component({
  selector: 'cm-attivita-giornaliera-eccezione-creazione',
  templateUrl: './attivita-giornaliera-eccezione-creazione.component.html',
  styleUrls: ['./attivita-giornaliera-eccezione-creazione.component.css']
})
export class AttivitaGiornalieraEccezioneCreazioneComponent implements OnInit {
  idAttivita: any;

  attivita: Attivita;
  competenze;
  studenti;
  dataInizio: string;
  dataFine: string;
  navTitle: string = "Crea eccezione";
  breadcrumbItems = [
    {
      title: "Lista eccezioni",
      location: "../../"
    },
    {
      title: "Dettaglio eccezione",
      location: "../../"
    },
    {
      title: "Ricerca",
      location: "../../search"
    },
    {
      title: "Risoluzione eccezione",
      location: "./"
    }
  ];
  datePickerConfig = {
    locale: 'it',
    firstDayOfWeek: 'mo',
    format: 'DD-MM-YYYY'
  };


  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private growler: GrowlerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idAttivita = params['idAttivita'];
      this.dataService.getOpportunitaById(this.idAttivita).subscribe((attivita) => {
        this.attivita = attivita;
        //check local storage and update competenze e studenti
        var opportunita = JSON.parse(sessionStorage.getItem('opportunita'));
        if (opportunita.dataInizio) {
          this.dataInizio = moment(opportunita.dataInizio).format('DD-MM-YYYY');
        }
        else {
          this.dataInizio = moment(this.attivita.dataInizio).format('DD-MM-YYYY');
        }
        if (opportunita.dataFine) {
          this.dataFine = moment(opportunita.dataFine).format('DD-MM-YYYY');
        }
        else {
          this.dataFine = moment(this.attivita.dataFine).format('DD-MM-YYYY');
        }
        this.competenze = JSON.parse(sessionStorage.getItem('competenze'));
        this.studenti = JSON.parse(sessionStorage.getItem('studenti'))
      })
    }
    )
  }
  create() {
    // var studenti = [];
    // var competenze =[];
    let dataInizio = moment(this.dataInizio, 'DD-MM-YYYY').valueOf();
    let dataFine = moment(this.dataFine, 'DD-MM-YYYY').valueOf();
    this.dataService.solveEccezione(sessionStorage.getItem('pianoAlternanzaId'), this.idAttivita, this.studenti, this.competenze, sessionStorage.getItem('eccezioneId'), dataInizio, dataFine).subscribe((res) => {
      if (res) {
        this.growler.growl('Attivita creata con successo.', GrowlerMessageType.Success);
        sessionStorage.removeItem('pianoAlternanzaId');
        sessionStorage.removeItem('studenti');
        sessionStorage.removeItem('eccezioneId');
        sessionStorage.removeItem('competenze');
        sessionStorage.removeItem('opportunita');

      } else {
        this.growler.growl("Errore nella creazione", GrowlerMessageType.Danger);
      }
      this.router.navigate(['../../'], { relativeTo: this.route });

    });

  }
  deleteCompetenza(competenzaDeleted) {
    //Todo delete competenza from the list
    // this.competenze.splice(index,1);
    this.competenze = this.competenze.filter(competenza => competenza.id != competenzaDeleted.id)
    
  }
  cancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });

  }
  deleteStudente(studenteDeleted) {
    this.studenti = this.studenti.filter(studente => studente.studenteId != studenteDeleted.studenteId)
  }
  addCompetenze() {
    //set on local storage
    sessionStorage.setItem('competenze', JSON.stringify(this.competenze));
    this.router.navigate(['modifica-competenze'], { relativeTo: this.route });

  }
  addStudenti() {
    //set on local storage
    sessionStorage.setItem('studenti', JSON.stringify(this.studenti));
    this.router.navigate(['modifica-studenti'], { relativeTo: this.route });

  }
}
