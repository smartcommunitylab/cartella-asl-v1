import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Opportunita } from '../../../../shared/classes/Opportunita.class';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'dettaglio-attivita-add-modal',
  templateUrl: './dettaglio-attivita-add.html',
  styleUrls:['./dettaglio-attivita-add.scss']
})
export class ProgrammaAddAttivitaModal {
  closeResult: string;

  @Input() opportunita: Opportunita;
  @Output() onAdd = new EventEmitter<string>();
  dataInizio;
  dataFine;


  datePickerConfig = {
    locale: 'it',
    firstDayOfWeek: 'mo'
  };

  constructor(public activeModal: NgbActiveModal, private dataService:DataService) { }

  add() {
    this.onAdd.emit('added');
    this.activeModal.close();
  }

}

