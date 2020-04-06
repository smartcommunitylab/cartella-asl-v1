import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompetenzaDetailModalComponent } from '../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { PianoAlternanza, AttivitaPiano } from '../../../shared/classes/PianoAlternanza.class';
import { ProgrammazioneService } from '../../../core/services/programmazione.service';
import { Competenza } from '../../../shared/classes/Competenza.class';
import { ProgrammaOpenAttivitaPianoModal } from '../actions/dettaglio-attivita-piano-modal/dettaglio-attivita-piano-modal.component';
import { ProgrammaOpenCompetenzaModal } from '../actions/dettaglio-competenza-modal/dettaglio-competenza-modal.component';
import { ProgrammaOpenAttivitaModal } from '../actions/dettaglio-attivita-modal/dettaglio-attivita-modal.component';
import { ProgrammaEccezioneModal } from '../actions/dettaglio-eccezione-modal/dettaglio-eccezione-modal.component';
import { ProgrammaCancellaAttivitaModal } from '../actions/cancella-attivita-modal/programma-cancella-attivita-modal.component';
import { attachEmbeddedView } from '@angular/core/src/view/view_attach';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';

@Component({
  selector: 'cm-studente-dettaglio',
  templateUrl: './studente-dettaglio.component.html',
  styleUrls: ['./studente-dettaglio.component.scss']
})
export class StudenteDettaglioComponent implements OnInit {

  private studente;
  private idPiano: string;
  private piano: PianoAlternanza;
  private annoCorso;
  reportStudente;
  private tipologieAttivita
  attivitaProgrammate: Attivita[];
  attivitaMancanti: any[];
  competenzeMancanti: Competenza[];
  competenzeProgrammate: Competenza[];
  eccezioni: any[];
  private singleActivity;


  navTitle: string = "Dettaglio studente";
  breadcrumbItems = [
    {
      title: "Lista programmi",
      location: "../../../incorso"
    },
    {
      title: "Dettaglio programma",
      location: "../../../",
      queryParams: {
        tab: "studenti"
      }
    },
    {
      title: "Dettaglio studente",
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
    private modalService: NgbModal,
    private growler: GrowlerService) {

  }

  init() {
    this.route.params.subscribe(params => {
      this.reportStudente = JSON.parse(sessionStorage.getItem('programmazioneDettaglioStudente'));
      if (!this.reportStudente || this.reportStudente.idStudente != params['studenteId']) {
        this.router.navigate(['../../../'], { relativeTo: this.route });
      }
			this.navTitle = this.reportStudente.nome;
      this.idPiano = params['id'];
      this.annoCorso = this.reportStudente.annoCorso;
      this.dataService.getStudenteReportByIdPage(this.idPiano, this.reportStudente.idStudente, this.programmazioneService.getActualYear(), this.annoCorso).subscribe((res) => {
        this.reportStudente = res.results.content[0];
        this.dataService.getAttivitaTipologie().subscribe((res) => {
          this.tipologieAttivita = res;
          this.dataService.getPianoById(this.idPiano).subscribe((piano: PianoAlternanza) => {
            this.piano = piano;
            this.dataService.getAttivitaForStudente(this.idPiano, this.annoCorso, this.reportStudente.idStudente).subscribe((attivitaProgrammate) => {
              this.attivitaProgrammate = attivitaProgrammate;
              for (let i = 0; i < this.attivitaProgrammate.length; i++) {
                this.attivitaProgrammate[i]["tipologia_descrizione"] = this.getTipologiaById(this.attivitaProgrammate[i].tipologia)
              }
              this.competenzeProgrammate = this.assignCompetenzeProgrammate(attivitaProgrammate);
              this.competenzeMancanti = this.assignCompetenzeMancanti(this.competenzeProgrammate);
              this.dataService.getAttivitaMancantiForStudente(this.idPiano, this.annoCorso, this.reportStudente.idStudente).subscribe((attivitaMancanti) => {
                this.attivitaMancanti = attivitaMancanti;
                for (let i = 0; i < this.attivitaMancanti.length; i++) {
                  this.attivitaMancanti[i]["tipologia_descrizione"] = this.getTipologiaById(this.attivitaMancanti[i].tipologia)
                  this.attivitaMancanti[i]["selected"] = false;
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
            () => console.log('get report by id'));


        },
          (err: any) => console.log(err),
          () => console.log('get tipologie'));
      },
        (err: any) => console.log(err),
        () => console.log('get tipologie'));
    });
  }

  ngOnInit() {
    this.init();

  }
  initEccezioni() {
    this.dataService.getEccezioniStudente(this.reportStudente.idStudente).subscribe((eccezioni) => {
      this.eccezioni = [];
      if (eccezioni[0])
        for (let key in eccezioni[0].eccezioni) {
          this.eccezioni.push(eccezioni[0].eccezioni[key]);
          this.eccezioni[this.eccezioni.length - 1]["tipologia_descrizione"] = this.getTipologiaById(eccezioni[0].eccezioni[key].tipologia)
        }
    }, (err: any) => {
      console.log(err)
    }, () => console.log("get eccezioni"));
  }


  panelChange($event, i) {
    this.singleActivity = undefined;
    this.dataService.getEsperienzaById(this.eccezioni[i].dettagli[0].esperienzaSvoltaId).subscribe((res: any) => {
      this.singleActivity = res;
    },
      (err: any) => console.log(err),
      () => console.log('get attivita by id'));


    this.eccezioni.forEach(element => {
      element.dettagli[0].selected = false;
    });
    this.eccezioni[i].dettagli[0].selected = $event.nextState;
  }

  getPercentage() {
    if (this.singleActivity && this.singleActivity.presenze && this.singleActivity.attivitaAlternanza && this.singleActivity.attivitaAlternanza.ore != 0)
      return (this.singleActivity.presenze.oreSvolte / this.singleActivity.attivitaAlternanza.ore) * 100
    return 0
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

  openDetailEccezione(i) {
    const modalRef = this.modalService.open(ProgrammaEccezioneModal, { size: "lg" });
    this.dataService.getEsperienzaById(this.eccezioni[i].dettagli[0].esperienzaSvoltaId).subscribe((res: any) => {
      modalRef.componentInstance.singleActivity = res;
    },
      (err: any) => console.log(err),
      () => console.log('get attivita by id'));
  }

  openConfirmDelete(attivita) {
    const modalRef = this.modalService.open(ProgrammaCancellaAttivitaModal, { size: "lg" });
    modalRef.componentInstance.attivita = attivita;
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        this.dataService.deleteEsperienzaSvoltaFromAttivita(attivita.id, this.reportStudente.idStudente).subscribe(
          (response: boolean) => {
            if (response) {
              this.growler.growl('Attivita cancellata con successo.', GrowlerMessageType.Success);
              this.init();
            } else {
              this.growler.growl("Errore nella cancellazione", GrowlerMessageType.Danger);
            }
          }
        );
      }
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

  assignCompetenzeMancanti(competenzeProgrammate: Competenza[]): Competenza[] {
    let competenze: Competenza[] = [];
    //rispetto al piano - quelle acquisite
    if (this.piano.competenze) {
      for (let competenza of this.piano.competenze) {
        if (!competenzeProgrammate.some(competenzaProgrammataAttay => competenzaProgrammataAttay.id == competenza.id) ) { 
          competenze.push(competenza);
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
    if (this.ricerca.attivita && this.ricerca.attivita != attivita.tipologia) {
      //remove attivita
      this.ricerca.attivita = attivita.tipologia;
    } else {
      this.ricerca.attivita = <Attivita>{};
    }

  }
  selectCompetenza(competenza) {
    //add or remove competenza for search
    console.log("added competenza");
    if (this.ricerca.competenze.filter(competenzeArray => competenzeArray === competenza.id).length > 0) {
      //remove attivita
      this.ricerca.competenze = this.ricerca.competenze.filter(competenzeArray => competenzeArray != competenza.id);


    } else {
      this.ricerca.competenze.push(competenza.id)

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
  getStyleOfAttivita(attivita) {
    if (this.ricerca.attivita && this.ricerca.attivita === attivita.tipologia) {
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

  openModifica(attivita) {
    this.router.navigate(['modifica/studenteAttivita/', attivita.id], { relativeTo: this.route });
  }

}
