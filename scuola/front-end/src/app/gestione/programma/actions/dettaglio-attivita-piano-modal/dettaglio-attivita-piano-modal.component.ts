import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../../shared/classes/Attivita.class';

@Component({
  selector: 'dettaglio-attivita-piano-modal',
  templateUrl: './dettaglio-attivita-piano-modal.html',
  styleUrls:['./dettaglio-attivita-piano-modal.scss']
})
export class ProgrammaOpenAttivitaPianoModal {
  closeResult: string;

  @Input() attivita: Attivita;
  @Output() onDelete = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal) { }
}

