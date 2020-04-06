import { Component, Output, Input, EventEmitter } from '@angular/core';
import { AttivitaPiano } from '../../../../../shared/classes/PianoAlternanza.class';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../core/services/data.service';

@Component({
  selector: 'cm-piano-attivita-delete-modal',
  templateUrl: './piano-attivita-delete-modal.component.html',
  styleUrls: ['./piano-attivita-delete-modal.component.css']
})
export class PianoAttivitaDeleteModal {


  @Input() attivita: AttivitaPiano;
  @Output() onDelete = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }
  delete() {
    this.onDelete.emit('deleted');
    this.activeModal.close();
  }

}
