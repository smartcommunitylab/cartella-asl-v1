import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompetenzaDetailModalComponent } from '../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { PianoAlternanza, AttivitaPiano } from '../../../shared/classes/PianoAlternanza.class';
import { ProgrammazioneService } from '../../../core/services/programmazione.service';
import { Competenza } from '../../../shared/classes/Competenza.class';
import { ProgrammaCancellaAttivitaModal } from '../actions/cancella-attivita-modal/programma-cancella-attivita-modal.component';
import { ProgrammaOpenAttivitaPianoModal } from '../actions/dettaglio-attivita-piano-modal/dettaglio-attivita-piano-modal.component';
import { ProgrammaOpenCompetenzaModal } from '../actions/dettaglio-competenza-modal/dettaglio-competenza-modal.component';
import { ProgrammaOpenAttivitaModal } from '../actions/dettaglio-attivita-modal/dettaglio-attivita-modal.component';
import { ProgrammaEccezioneModal } from '../actions/dettaglio-eccezione-modal/dettaglio-eccezione-modal.component';
@Component({
  selector: 'cm-classe-dettaglio',
  templateUrl: './classe-dettaglio.component.html',
  styleUrls: ['./classe-dettaglio.component.scss']
})
export class ClasseDettaglioComponent implements OnInit {
  private classe;
  private idPiano: string;
  private piano: PianoAlternanza;
  private annoCorso;
  private tipologieAttivita;
  reportClasse;
  attivitaProgrammate: Attivita[];
  attivitaMancanti: any[];
  competenzeMancanti: any[];
  competenzeProgrammate: any[];
  eccezioni: any[];
  navTitle: string = "Dettaglio classe";
  breadcrumbItems = [
    {
      title: "Lista programmi",
      location: "../../../../../incorso"
    },
    {
      title: "Dettaglio programma",
      location: "../../../",
      queryParams: {
        tab: "classi"
      }
    },
    {
      title: "Dettaglio classe",
      location: "./"
    }
  ];
  ricerca = {
    istitutoId:this.dataService.istitudeId,   
    attivita: {},
    competenze: []
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private programmazioneService: ProgrammazioneService,
    private modalService: NgbModal) {

  }

  init() {
    this.route.params.subscribe(params => {
      this.reportClasse = JSON.parse(sessionStorage.getItem('programmazioneDettaglioClasse'));
      if (!this.reportClasse || this.reportClasse.nome != params['classeNome']) {
        this.router.navigate(['../../../'], { relativeTo: this.route });
      }
      this.navTitle = this.reportClasse.nome;
      this.idPiano = params['id'];
      this.annoCorso = this.reportClasse.annoCorso;
      this.dataService.getClassiReportByClassePage(this.idPiano, this.reportClasse.nome, this.programmazioneService.getActualYear(), this.annoCorso).subscribe((res) => {
        this.reportClasse = res.results.content[0];

        this.dataService.getAttivitaTipologie().subscribe((res) => {
          this.tipologieAttivita = res;
          this.dataService.getPianoByIdJson(this.idPiano).subscribe((piano: PianoAlternanza) => {
            this.piano = piano;
            this.dataService.getAttivitaForClasse(this.idPiano, this.annoCorso, this.reportClasse.nome).subscribe((attivitaProgrammate) => {
              this.attivitaProgrammate = attivitaProgrammate;
              for (let i = 0; i < this.attivitaProgrammate.length; i++) {
                this.attivitaProgrammate[i]["tipologia_descrizione"] = this.getTipologiaById(this.attivitaProgrammate[i].tipologia)
              }
              this.competenzeProgrammate = this.assignCompetenzeProgrammate(attivitaProgrammate);
              this.competenzeMancanti = this.assignCompetenzeMancanti(this.competenzeProgrammate);
              this.dataService.getAttivitaMancantiForClasse(this.idPiano, this.annoCorso, this.reportClasse.nome).subscribe((attivitaMancanti) => {
                this.attivitaMancanti = attivitaMancanti;
                for (let i = 0; i < this.attivitaMancanti.length; i++) {
                  this.attivitaMancanti[i]["tipologia_descrizione"] = this.getTipologiaById(this.attivitaMancanti[i].tipologia)
                }

                this.initEccezioni();

              },
                (err: any) => console.log(err),
                () => console.log('get attivita mancanti'));

            },
              (err: any) => console.log(err),
              () => console.log('get attivita'));

          },
            (err: any) => console.log(err),
            () => console.log('get piano'));
        },
          (err: any) => console.log(err),
          () => console.log('get tipologie'));

      },
        (err: any) => console.log(err),
        () => console.log('get report aggiornato'));

    });
  }
  ngOnInit() {
    this.init();
  }
  initEccezioni() {
    this.dataService.getEccezioniClasse(this.reportClasse.nome).subscribe((eccezioni) => {
      this.eccezioni = [];
      if (eccezioni[0])
        for (let key in eccezioni[0].eccezioni) {
          this.eccezioni.push(eccezioni[0].eccezioni[key]);
          this.eccezioni[this.eccezioni.length - 1]["tipologia_descrizione"] = this.getTipologiaById(eccezioni[0].eccezioni[key].tipologia);
        }
    }, (err: any) => {
      console.log(err)
    }, () => console.log("get eccezioni"));
  }
  openDetailAttivitaPiano(attivita) {
    const modalRef = this.modalService.open(ProgrammaOpenAttivitaPianoModal, { size: "lg" });
    modalRef.componentInstance.attivita = attivita;
  }

  openDetailCompetenza(competenza) {
    const modalRef = this.modalService.open(ProgrammaOpenCompetenzaModal, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }
  openDetailAttivita(attivita) {
    const modalRef = this.modalService.open(ProgrammaOpenAttivitaModal, { size: "lg" });
    modalRef.componentInstance.attivita = attivita;
  }
  openConfirmDelete(attivita) {
    const modalRef = this.modalService.open(ProgrammaCancellaAttivitaModal, { size: "lg" });
    modalRef.componentInstance.attivita = attivita;
    modalRef.componentInstance.onDelete.subscribe((res) => {
      this.init();
      // this.attivitaProgrammate.splice(this.attivitaMancanti.indexOf(attivita), 1);
    });
  }
  getColorBar(programmate, totali) {
    if (programmate >= totali) {
      return 'success';
    }
    if (programmate >= totali / 2) {
      return 'warning';
    }
    if (programmate <= totali / 2) {
      return 'danger';
    }
  }
  getTipologiaById(id) {
    if (this.tipologieAttivita)
      for (let i = 0; i < this.tipologieAttivita.length; i++) {
        if (this.tipologieAttivita[i].tipologia === id) {
          return this.tipologieAttivita[i].titolo;
        }
      }
    return "";
  }
  assignCompetenzeMancanti(competenzeProgrammate: any[]): any[] {
    let competenze: any[] = [];
    //rispetto al piano - quelle acquisite
    if (this.piano.competenze) {
      for (let competenza of this.piano.competenze) {
        if (!competenzeProgrammate.some(competenzaProgrammataAttay => competenzaProgrammataAttay.id == competenza.id) ) { 
          competenze.push(competenza );
        }
      }
    }
    return competenze;
  }
  assignCompetenzeProgrammate(attivitaProgrammate: any[]): Competenza[] {
    let competenze: Competenza[] = [];
    //rispetto alle attivita pianificate
    for (let attivita of attivitaProgrammate) {
      let att;
      if (attivita.opportunita) {
        att = attivita.opportunita;
      }
      if (attivita.corsoInterno) {
        att = attivita.corsoInterno;
      }
      if (att.competenze) {
        for (let competenza of att.competenze) {
          if (competenze.filter(competenzaArray => competenza.id == competenzaArray.id).length == 0) {
            competenze.push(competenza)
          }
        }
      }
    }
    return competenze;
  }
  selectAttivita(attivita: Attivita) {
    //add or remove attivita for search
    this.attivitaMancanti.forEach((item) => {
      if (item.tipologia != attivita.tipologia)
        item.selected = false;
      else
        item.selected = !item.selected;
    })
    console.log("added attivita");
    //disable all the others
    if (this.ricerca.attivita && this.ricerca.attivita != attivita.tipologia) {
      //remove attivita
      this.ricerca.attivita = attivita.tipologia;
    } else {
      this.ricerca.attivita = <Attivita>{};
    }

  }
  selectCompetenza(competenza) {
    //add or remove competenza for search
    ////disable all the others
    console.log("added competenza");
    if (this.ricerca.competenze.filter(competenzeArray => competenzeArray === competenza.id).length > 0) {
      //remove attivita
      this.ricerca.competenze = this.ricerca.competenze.filter(competenzeArray => competenzeArray != competenza.id);


    } else {
      this.ricerca.competenze.push(competenza.id)

    }
  }
  openDetailEccezione(i) {
    const modalRef = this.modalService.open(ProgrammaEccezioneModal, { size: "lg" });
    this.dataService.getEsperienzaById(this.eccezioni[i].dettagli[0].esperienzaSvoltaId).subscribe((res: any) => {
      modalRef.componentInstance.singleActivity = res;
    },
      (err: any) => console.log(err),
      () => console.log('get attivita by id'));
  }
  getStyleOfAttivita(attivita) {
    if (this.ricerca.attivita === attivita.tipologia) {
      return "yellow";

    }
    return "white";
  }
  getStyleOfCompetenza(competenza) {
    if (this.ricerca.competenze.filter(competenzeArray => competenzeArray === competenza.id).length > 0) {
      return "yellow";

    }
    return "white";
  }
  openSearch() {
    console.log("vai in search" + JSON.stringify(this.ricerca));
    sessionStorage.setItem('searchActivitiesOptions', JSON.stringify(this.ricerca));
    this.router.navigate(['search', this.annoCorso], { relativeTo: this.route });

  }
}
