import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Competenza } from '../../../../shared/classes/Competenza.class';

@Component({
  selector: 'dettaglio-competenza-modal',
  templateUrl: './dettaglio-competenza-modal.html',
  styleUrls:['./dettaglio-competenza-modal.scss']
})
export class ProgrammaOpenCompetenzaModal {
  closeResult: string;

  @Input() competenza: Competenza;
  @Output() onDelete = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal) { }
}

