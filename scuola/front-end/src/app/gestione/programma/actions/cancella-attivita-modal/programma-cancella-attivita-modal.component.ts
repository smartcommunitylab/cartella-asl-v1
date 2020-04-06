import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../core/services/data.service'
import { Attivita } from '../../../../shared/classes/Attivita.class';

@Component({
  selector: 'programma-cancella-attivita-modal',
  templateUrl: './programma-cancella-attivita-modal.html',
  styleUrls:['./programma-cancella-attivita-modal.scss']
})
export class ProgrammaCancellaAttivitaModal {
  closeResult: string;
  titolo: any;
  type: any;

  @Input() attivita: Attivita;
  @Output() onDelete = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }
  delete() {
    this.activeModal.close("DEL");
  }
}

