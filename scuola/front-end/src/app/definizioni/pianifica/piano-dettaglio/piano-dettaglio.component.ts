import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PianoAlternanza } from '../../../shared/classes/PianoAlternanza.class';
import { CompetenzaDetailModalComponent } from '../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { PianificaCancellaModal } from '../actions/cancella-piano-modal/pianifica-cancella-modal.component';
import { PianoAttivitaDeleteModal } from './modals/piano-attivita-delete-modal/piano-attivita-delete-modal.component';
import { NewPianoModalComponent } from '../actions/new-piano-modal/new-piano-modal.component';
import { ActivatePianoModal } from '../actions/activate-piano-modal/activate-piano-modal.component';
import { DeleteCompetenzaModalComponent } from '../actions/delete-competenza-modal/delete-competenza-modal.component';
import { SorterService } from '../../../core/services/sorter.service';
@Component({
  selector: 'cm-piano-dettaglio',
  templateUrl: './piano-dettaglio.component.html',
  styleUrls: ['./piano-dettaglio.component.css']
})
export class PianoDettaglioComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private sorterService: SorterService) { }

  piano: PianoAlternanza;
  navTitle: string = "Dettaglio piano alternanza";
  cardTitle: string = "Vedi";
  breadcrumbItems = [
    {
      title: "Piani alternanza",
      location: "../../"
    },
    {
      title: "Dettaglio piano",
      location: "./"
    }
  ];

  corsiStudio;
  tipologie;

  yearsHours;
  yearsHoursTotal;

  tabDefaultSelectedId;

  noActivitySetted: boolean = true;
  
  order: string = 'titolo';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['year']) {
        this.tabDefaultSelectedId = 'tab-year-' + params['year'];
        console.log(this.tabDefaultSelectedId);
      }
    });
    this.route.params.subscribe(params => {
      let id = params['id'];
      
      this.dataService.getPianoById(id).subscribe((piano: PianoAlternanza) => {
        this.piano = piano;
        this.navTitle = piano.titolo;

        this.yearsHours = [];
        this.yearsHours.push(
          {
            ore: this.piano.anniAlternanza[0].oreTotali,
            color: "#F57C00",
            textColor: "#000"
          }
        );
        this.yearsHours.push(
          {
            ore: this.piano.anniAlternanza[1].oreTotali,
            color: "#FF9800",
            textColor: "#000"
          }
        );
        this.yearsHours.push(
          {
            ore: this.piano.anniAlternanza[2].oreTotali,
            color: "#FFB74D",
            textColor: "#000"
          }
        );
        this.yearsHoursTotal = this.piano.anniAlternanza[0].oreTotali + this.piano.anniAlternanza[1].oreTotali + this.piano.anniAlternanza[2].oreTotali;
        
        this.noActivitySetted = true;
        if (this.piano.anniAlternanza[0].tipologieAttivita.length > 0 ||
            this.piano.anniAlternanza[1].tipologieAttivita.length > 0 ||
            this.piano.anniAlternanza[2].tipologieAttivita.length > 0) {
          this.noActivitySetted = false;
        }
        if (this.piano.attivo) {
          this.cardTitle = 'Vedi';
        } else {
          this.cardTitle = 'Compila piano';
        }
        //default sort.
        this.sorterService.sort(this.piano.competenze, this.order, -1);
      },
        (err: any) => console.log(err),
        () => console.log('get piano by id'));
    });
    this.dataService.getCorsiStudio().subscribe((response) => {
      this.corsiStudio = response;
    })
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologie = res;
    });

  }
  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }
  deleteCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();

    const modalRef = this.modalService.open(DeleteCompetenzaModalComponent);
    modalRef.componentInstance.onDelete.subscribe((res) => {
      this.dataService.deleteCompetenzaFromPiano(this.piano.id, competenza.id).subscribe((res: PianoAlternanza) => {
        this.piano = res;
      },
        (err: any) => console.log(err),
        () => console.log('delete competenza from attivita'));
    });
    
  }

  openDetail(attivita) {
    this.router.navigate([attivita.id], { relativeTo: this.route });
  }
  openDeleteActivity(annoAlternanza, attivita) {
    const modalRef = this.modalService.open(PianoAttivitaDeleteModal);
    modalRef.componentInstance.attivita = attivita;
    modalRef.componentInstance.onDelete.subscribe((res) => {
      this.dataService.deleteAttivitaFromPiano(annoAlternanza.id, attivita.id).subscribe((res) => {
        annoAlternanza.tipologieAttivita.splice(annoAlternanza.tipologieAttivita.indexOf(attivita), 1);
      });
    });
  }
  changeStatusPiano(attivo) {
    const modalRef = this.modalService.open(ActivatePianoModal);
    modalRef.componentInstance.piano = this.piano;
    modalRef.componentInstance.onSuccess.subscribe((piano) => {
      this.dataService.attivaPiano(this.piano, attivo).subscribe((res) => {
        this.ngOnInit();
      });
    });    
  }
  deletePiano() {
    const modalRef = this.modalService.open(PianificaCancellaModal);
    modalRef.componentInstance.piano = this.piano;
    modalRef.componentInstance.onDelete.subscribe((res) => {
      this.router.navigate(["../"], { relativeTo: this.route });
    });
  }
  editPiano() {
    const modalRef = this.modalService.open(NewPianoModalComponent);
    modalRef.componentInstance.piano = this.piano;
    modalRef.componentInstance.corsiStudio = this.corsiStudio;
    modalRef.componentInstance.newPianoListener.subscribe((piano) => {
      this.dataService.updatePianoDetails(piano).subscribe((pianoUpdated) => {
        let initChecker = 0;
        for (let index = 0; index < 3; index++) {
          this.dataService.updatePianoAnnoOre(piano.anniAlternanza[index]).subscribe((piano) => {
            initChecker++;
            if (initChecker == 3) {
              this.ngOnInit();
            }
          });
        }
      });
    });
  }
  changeHour(actualClass) {
    this.dataService.updatePianoAnnoOre(this.piano.anniAlternanza[actualClass]).subscribe((piano) => {
      this.ngOnInit();
    });
  }

  getCorsoDiStudioString(corsoStudioId) {
    if (this.corsiStudio) {
      let rtn = this.corsiStudio.find(data => data.courseId == corsoStudioId);
      if (rtn) return rtn.titolo;
      return corsoStudioId;
    } else {
      return corsoStudioId;
    }
  }

  getTipologiaString(tipologiaId) {
    if (this.tipologie) {
      let rtn = this.tipologie.find(data => data.id == tipologiaId);
      if (rtn) return rtn.titolo;
      return tipologiaId;
    } else {
      return tipologiaId;
    }
  }
  getTipologia(tipologiaId) {
    if (this.tipologie) {
      return this.tipologie.find(data => data.id == tipologiaId);
    } else {
      return {};
    }
  }

  onSelectChange(ev) {
    this.sorterService.sort(this.piano.competenze, this.order, -1);
  }

}
