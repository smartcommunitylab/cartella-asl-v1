import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompetenzaDetailModalComponent } from '../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { NoteStudenteEditModalComponent } from './modals/note-studente-edit-modal/note-studente-edit-modal.component';
import { DocumentUploadModalComponent } from './modals/document-upload-modal/document-upload-modal.component';
import { serverAPIConfig } from '../../core/serverAPIConfig'

@Component({
  selector: 'cm-attivita-detail',
  templateUrl: './attivita-detail.component.html',
  styleUrls: ['./attivita-detail.component.css']
})
export class AttivitaDetailComponent implements OnInit {

  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal) { }

  navTitle: string = "Dettaglio attività";
  breadcrumbItems = [
    {
      title: "Piani alternanza",
      location: "../../"
    },
    {
      title: "Dettaglio attività",
      location: "./"
    }
  ];

  corsiStudio;
  tipologie;
  attivita;
  schedaValutazioneLink;

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getAttivitaStudenteById(id).subscribe((attivita) => {
        this.attivita = attivita;
        this.navTitle = this.attivita.attivitaAlternanza.titolo;
        
        this.attivita.documenti.forEach(element => {
          this.dataService.getDocumentoById(element.id).subscribe(res => {
            let response = JSON.parse(res);
            element.url = serverAPIConfig.host + '/' + response.url;
          });          
        });
      },
        (err: any) => console.log(err),
        () => console.log('get attivita studente by id'));

      this.loadSchedaValutazioneLink(id);
      
    });
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologie = res;
    });

  }
  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
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
  getTipologiaAttivita(tipologiaId) {
    if (this.tipologie) {
      return this.tipologie.find(data => data.id == tipologiaId);
    } else {
      return tipologiaId;
    }
  }

  editStudentNote() {
    const modalRef = this.modalService.open(NoteStudenteEditModalComponent, { size: "lg" });
    modalRef.componentInstance.note = this.attivita.noteStudente;
    modalRef.componentInstance.titolo = this.attivita.attivitaAlternanza.titolo;
    modalRef.componentInstance.esperienzaId = this.attivita.id;
    modalRef.componentInstance.noteSaved.subscribe(nota => {
      this.attivita.noteStudente = nota;
    });
  }

  loadSchedaValutazioneLink(id) {
    this.dataService.getSchedaValutazione(id).subscribe((scheda) => {
      let response = JSON.parse(scheda);
      this.schedaValutazioneLink = serverAPIConfig.host + '/' + response.url;
      console.log(this.schedaValutazioneLink);
    },
      (err: any) => console.log(err),
      () => console.log('get scheda valutazione studente'));
  }

  uploadSchedaValutazione(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.dataService.saveSchedaValutazione(this.attivita.id, fileInput.target.files[0]).subscribe((scheda) => {
        let response = JSON.parse(scheda);
        this.schedaValutazioneLink = serverAPIConfig.host + '/' + response.url;
        // this.loadSchedaValutazioneLink(this.attivita.id);
      },
        (err: any) => console.log(err),
        () => console.log('upload scheda valutazione studente'));
    }    
  }

  deleteSchedaValutazione() {
    this.dataService.deleteSchedaValutazione(this.attivita.id).subscribe((deleted) => {
      if (deleted) this.schedaValutazioneLink = undefined;
    },
      (err: any) => console.log(err),
      () => console.log('delete scheda valutazione studente'));
  }


  uploadDocumento() {
    const modalRef = this.modalService.open(DocumentUploadModalComponent, { size: "lg" });
    modalRef.componentInstance.esperienzaId = this.attivita.id;
    modalRef.componentInstance.documentSaved.subscribe(documento => {
      this.dataService.getDocumentoById(documento.id).subscribe(res => {
        // documento.url = res;
        let response = JSON.parse(res);
        documento.url = serverAPIConfig.host + '/' + response.url;
        this.attivita.documenti.push(documento);
      });
      
    });
  }

  changeDocumento(originalDocumento) {
    const modalRef = this.modalService.open(DocumentUploadModalComponent, { size: "lg" });
    modalRef.componentInstance.document = originalDocumento;
    modalRef.componentInstance.documentSaved.subscribe(documento => {
      this.dataService.getDocumentoById(documento.id).subscribe(res => {
        // documento.url = res;
        let response = JSON.parse(res);
        documento.url = serverAPIConfig.host + '/' + response.url;        
        let index = this.attivita.documenti.indexOf(originalDocumento);
        if (index > -1) {
          this.attivita.documenti[index] = documento;
        }
      });      
    });
  }

  deleteDocumento(documento) {
    this.dataService.deleteDocumentoById(documento.id, this.attivita.id).subscribe((deleted) => {
      if (deleted) {
        this.attivita.documenti.splice(this.attivita.documenti.indexOf(documento),1);
      }
    },
      (err: any) => console.log(err),
      () => console.log('delete scheda valutazione studente'));
  }

}
