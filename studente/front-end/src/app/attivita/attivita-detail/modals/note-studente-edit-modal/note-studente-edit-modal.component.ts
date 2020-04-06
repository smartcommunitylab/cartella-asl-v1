import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'cm-note-studente-edit-modal',
  templateUrl: './note-studente-edit-modal.component.html',
  styleUrls: ['./note-studente-edit-modal.component.css']
})
export class NoteStudenteEditModalComponent implements OnInit {

  @Input() note:string;
  @Input() titolo:string;
  @Input() esperienzaId;

  @Output() noteSaved = new EventEmitter<string>();
  asd = "TROLOL asdl"

  constructor(public activeModal: NgbActiveModal, private dataService: DataService) { }

  ngOnInit() {
    console.log(this.note);
  }

  save() {
    this.dataService.saveNoteStudente(this.esperienzaId, this.note).subscribe(res => {
      this.noteSaved.emit(this.note);
      this.activeModal.close();
    },
      (err: any) => console.log(err),
      () => console.log('save note studente')
    );
  }

}
