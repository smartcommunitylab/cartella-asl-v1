import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Richiesta } from '../../../../shared/classes/Richiesta.class';

@Component({
  selector: 'cm-refuse-request-confirm-modal',
  templateUrl: './refuse-request-confirm-modal.component.html',
  styleUrls: ['./refuse-request-confirm-modal.component.css']
})
export class RefuseRequestConfirmModalComponent implements OnInit {
  @Input() richiesta: Richiesta;
  @Output() onConfirmRefuse = new EventEmitter<Richiesta>(); //return the request id
  refuseMotivation;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    
  }

  refuseRequest() {
    //TODO: add refuse motivation
    this.onConfirmRefuse.emit(this.richiesta);
    this.activeModal.dismiss('confirmRefuse');
  }

}
