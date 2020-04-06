import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'cm-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit {

  @Input() attivitaTitolo: string;
  @Input() popupTitle: string;
  @Input() popupText: string;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
      console.log(this.attivitaTitolo);
  }

}
