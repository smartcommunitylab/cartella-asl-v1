import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/data.service'
import { Attivita } from '../../../shared/classes/Attivita.class'

@Component({
  selector: 'attivita-cancella-modal',
  templateUrl: './attivita-cancella-modal.html',
  styleUrls:['./attivita-cancella-modal.scss']
})
export class AttivitaCancellaModal {
  closeResult: string;

  // @Input() attivita: Attivita;
  @Input() title: string;
  @Input() type: string;
  
  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }
  delete() {
    this.activeModal.close("DEL");
  }
}

