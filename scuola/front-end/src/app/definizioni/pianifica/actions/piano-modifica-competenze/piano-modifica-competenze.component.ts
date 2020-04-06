import { Component, OnInit } from '@angular/core';
import { PianoAlternanza } from '../../../../shared/classes/PianoAlternanza.class';
import { Competenza } from '../../../../shared/classes/Competenza.class';
import { DataService } from '../../../../core/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-piano-modifica-competenze',
  templateUrl: './piano-modifica-competenze.component.html',
  styleUrls: ['./piano-modifica-competenze.component.css']
})
export class PianoModificaCompetenzeComponent implements OnInit {

  piano: PianoAlternanza;
  addCompetenzeBtnText:string = "Aggiungi competenze";
  navTitle:string = "";
  breadcrumbItems = [
    {
      title: "Piani alternanza",
      location: "../../../"
    },
    {
      title: "Dettaglio piano",
      location: "../"
    },
    {
      title: "Aggiunta competenze",
      location: "./"
    }
  ];


  attachedCompetenze: Competenza[]; //competenze already added to the piano

  constructor(private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      let id = params['id'];

      this.dataService.getPianoById(id).subscribe((piano: PianoAlternanza) => {
        this.piano = piano;
        this.attachedCompetenze = piano.competenze;
        this.navTitle = this.piano.titolo + ' - Aggiunta competenze';
      },
        (err: any) => console.log(err),
        () => console.log('get piano'));
    });
  }

  addNewCompetenze(competenze: Competenza[]) {
    this.dataService.assignCompetenzeToPiano(this.piano.id, competenze)
    .subscribe((res) => {
      this.router.navigate(['../'], {relativeTo: this.activeRoute});
    },
    (err: any) => console.log(err));
  }

}
