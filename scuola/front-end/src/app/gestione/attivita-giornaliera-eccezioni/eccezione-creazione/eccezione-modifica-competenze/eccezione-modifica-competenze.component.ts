import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { Competenza } from '../../../../shared/classes/Competenza.class';

@Component({
  selector: 'cm-eccezione-modifica-competenze',
  templateUrl: './eccezione-modifica-competenze.component.html',
  styleUrls: ['./eccezione-modifica-competenze.component.css']
})
export class EccezioneModificaCompetenzeComponent implements OnInit {
  competenze = [];

  // piano: PianoAlternanza;
  addCompetenzeBtnText: string = "Aggiungi competenze";
  navTitle: string = "Modifica competenze eccezione";
  breadcrumbItems = [
    {
      title: "Lista eccezioni",
      location: "../../../",
    },
    {
      title: "Dettaglio eccezione",
      location: "../../../"
    },
    {
      title: "Ricerca",
      location: "../../../search"
    },
    {
      title: "Risoluzione eccezione",
      location: "../"
    },
    {
      title: "Modifica competenze",
      location: "./"
    }
  ];


  attachedCompetenze: Competenza[]; //competenze already added to the piano

  constructor(private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute) { }


  ngOnChanges() {
    this.initAttachedCompetenze();
  }
  ngOnInit() {
    this.initAttachedCompetenze();
  }

  initAttachedCompetenze() {
    this.competenze = JSON.parse(sessionStorage.getItem('competenze'))
    this.attachedCompetenze = JSON.parse(sessionStorage.getItem('competenze'));
  }
  addNewCompetenze(competenze: Competenza[]) {
    for (let i = 0; i < competenze.length; i++) {
      this.competenze.push(competenze[i])
    };
    sessionStorage.setItem('competenze', JSON.stringify(this.competenze))
    this.router.navigate(['../'], { relativeTo: this.activeRoute });
  }

}
