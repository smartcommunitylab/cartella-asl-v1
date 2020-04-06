import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'competenze-cancella-modal',
  templateUrl: './competenze-cancella-modal.html',
  styleUrls:['./competenze-cancella-modal.scss']
})
export class CompetenzeCancellaModal {
  closeResult: string;

  @Input() title: string;
  @Input() type: string;
  
  constructor(public activeModal: NgbActiveModal) { }
  delete() {
    this.activeModal.close("DEL");
  }
}

