import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'cm-document-upload-modal',
  templateUrl: './document-upload-modal.component.html',
  styleUrls: ['./document-upload-modal.component.css']
})
export class DocumentUploadModalComponent implements OnInit {

  @Input() esperienzaId; //used for new Document
  @Input() document; //used for existing document
  @Output() documentSaved = new EventEmitter();

  documentName;
  documentFile;

  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }

  ngOnInit() {
    if (this.document) {
      this.documentName = this.document.nome;
    }
  }

  selectFile(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.documentFile = fileInput.target.files[0];
    }
  }

  upload() {
    if (this.document) { //edit
      this.dataService.saveDocumentoById(this.document.id, this.documentFile, this.documentName).subscribe((documento) => {
        this.documentSaved.emit(documento.body);
        this.activeModal.close();
      },
        (err: any) => console.log(err),
        () => console.log('upload edit documento studente'));
    } else { //new
      this.dataService.createDocumento(this.esperienzaId, this.documentFile, this.documentName).subscribe((documento) => {
        this.documentSaved.emit(documento.body);
        this.activeModal.close();
      },
        (err: any) => console.log(err),
        () => console.log('upload new documento studente'));
    }
    
  }

}
