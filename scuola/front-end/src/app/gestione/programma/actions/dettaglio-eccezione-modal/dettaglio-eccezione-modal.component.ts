import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Attivita } from '../../../../shared/classes/Attivita.class';

@Component({
  selector: 'dettaglio-eccezione-modal',
  templateUrl: './dettaglio-eccezione-modal.html',
  styleUrls:['./dettaglio-eccezione-modal.scss']
})
export class ProgrammaEccezioneModal {
  closeResult: string;

  @Input() singleActivity: any;

  constructor(public activeModal: NgbActiveModal) { }
  
  getPercentage() {
    if (this.singleActivity && this.singleActivity.presenze && this.singleActivity.attivitaAlternanza && this.singleActivity.attivitaAlternanza.ore != 0)
      return (this.singleActivity.presenze.oreSvolte / this.singleActivity.attivitaAlternanza.ore) * 100
    return 0
  }
}

