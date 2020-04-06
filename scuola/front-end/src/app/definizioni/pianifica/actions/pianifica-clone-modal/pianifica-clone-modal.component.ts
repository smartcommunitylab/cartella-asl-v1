import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PianoAlternanza } from '../../../../shared/classes/PianoAlternanza.class';
@Component({
  selector: 'cm-pianifica-clone-modal',
  templateUrl: './pianifica-clone-modal.component.html',
  styleUrls: ['./pianifica-clone-modal.component.css']
})
export class PianificaCloneModal {

  @Input() piano: PianoAlternanza;
  @Output() onCloneConfirm = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal) { }

  cloneConfirm() {
    this.activeModal.close();
    this.onCloneConfirm.emit('cloneConfirm');
  }

}
