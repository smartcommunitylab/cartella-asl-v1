import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'cm-delete-competenza-modal',
  templateUrl: './delete-competenza-modal.component.html',
  styleUrls: ['./delete-competenza-modal.component.css']
})
export class DeleteCompetenzaModalComponent {

  @Output() onDelete = new EventEmitter<string>();
  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }

  delete() {    
    this.activeModal.close();
    this.onDelete.emit('deleted');
  }

}
