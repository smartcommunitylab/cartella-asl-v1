import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../../shared/classes/Attivita.class';

@Component({
  selector: 'dettaglio-attivita-modal',
  templateUrl: './dettaglio-attivita-modal.html',
  styleUrls:['./dettaglio-attivita-modal.scss']
})
export class ProgrammaOpenAttivitaModal {
  closeResult: string;

  @Input() attivita: Attivita;

  constructor(public activeModal: NgbActiveModal) { }
}

