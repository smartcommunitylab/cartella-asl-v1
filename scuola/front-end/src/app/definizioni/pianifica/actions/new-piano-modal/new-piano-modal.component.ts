import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../core/services/data.service';
import { PianoAlternanza } from '../../../../shared/classes/PianoAlternanza.class';

@Component({
  selector: 'cm-new-piano-modal',
  templateUrl: './new-piano-modal.component.html',
  styleUrls: ['./new-piano-modal.component.css']
})
export class NewPianoModalComponent implements OnInit {

  titolo: string;
  annoRiferimento;
  oreTerzoAnno: number;
  oreQuartoAnno: number;
  oreQuintoAnno: number;
  note: string
    ;
  fieldsError:string;

  @Input() corsoStudioId?:any;
  @Input() corsiStudio?:any; //list of corsi studio

  @Input() piano?:PianoAlternanza;

  @Output() newPianoListener = new EventEmitter<Object>();


  constructor(public activeModal: NgbActiveModal, public dataService: DataService) { }

  ngOnInit() {
    if (!this.corsiStudio) {
      this.dataService.getCorsiStudio().subscribe((response) => {
        this.corsiStudio = response;
      },
      (err: any) => console.log(err));
    }
    
    this.annoRiferimento = (new Date()).getFullYear();

    if (this.piano) {
      this.titolo = this.piano.titolo;
      this.note = this.piano.note;
      this.annoRiferimento = new Date(this.piano.inizioValidita).getFullYear();
      this.corsoStudioId = this.piano.corsoDiStudioId;
      this.oreTerzoAnno = this.piano.anniAlternanza[0].oreTotali;
      this.oreQuartoAnno = this.piano.anniAlternanza[1].oreTotali;
      this.oreQuintoAnno = this.piano.anniAlternanza[2].oreTotali;
    } else {
      this.oreTerzoAnno = 150;
      this.oreQuartoAnno = 150;
      this.oreQuintoAnno = 100;

    }

  }

  create() { //create or update
    let piano;
    console.log(this.corsoStudioId);
    if (this.piano) {
      piano = this.piano;
      piano.titolo = this.titolo;
      piano.note = this.note;
      piano.corsoDiStudio = this.corsiStudio.find(corso => corso.courseId == this.corsoStudioId).nome;
      piano.corsoDiStudioId = this.corsoStudioId
      piano.inizioValidita = new Date(this.annoRiferimento + "-09").getTime()
      piano.fineValidita = new Date((+this.annoRiferimento+3) + "-06-15").getTime()
      this.piano.anniAlternanza[0].oreTotali = this.oreTerzoAnno;
      this.piano.anniAlternanza[1].oreTotali = this.oreQuartoAnno;
      this.piano.anniAlternanza[2].oreTotali = this.oreQuintoAnno;
    } else {
      piano = {
        titolo: this.titolo,
        note: this.note,
        corsoDiStudioId: this.corsoStudioId,
        corsoDiStudio :this.corsiStudio.find(corso => corso.courseId == this.corsoStudioId).nome,
        inizioValidita: new Date(this.annoRiferimento + "-09").getTime(), //starts from september
        fineValidita: new Date((+this.annoRiferimento+3) + "-06-15").getTime(), //ends about in mid june
        attivo: false,
        anniAlternanza: [
          {
            oreTotali: this.oreTerzoAnno
          },
          {
            oreTotali: this.oreQuartoAnno
          },
          {
            oreTotali: this.oreQuintoAnno
          }
        ]
      }
    }
    this.newPianoListener.emit(piano);
    this.activeModal.dismiss('create')
  }

}
