import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Attivita } from '../../../../shared/classes/Attivita.class';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'cm-archivia-corso-modal',
  templateUrl: './archivia-corso-modal.component.html'
})
export class ArchiviaCorsoModalComponent implements OnInit {

  @Input() corso:Attivita;
  @Output() onArchivia = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
      console.log(this.corso);
  }

  archivia() {
    this.activeModal.close();
    this.onArchivia.emit('archivia');
  }

}
