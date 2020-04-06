import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/data.service'

@Component({
  selector: 'azienda-cancella-modal',
  templateUrl: './azienda-cancella-modal.html',
  styleUrls:['./azienda-cancella-modal.scss']
})
export class AziendaCancellaModal {
  closeResult: string;

  @Input() title: string;
  @Input() type: string;
  
  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }
  delete() {
    this.activeModal.close("DEL");
  }
}

