import { Component, OnInit } from '@angular/core';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { ProfiloCompetenza } from '../../../shared/classes/ProfiloCompetenza.class';
import { Competenza } from '../../../shared/classes/Competenza.class';
import { DataService } from '../../../core/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillsSelectorComponent } from '../../../skills-selector/skills-selector.component';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';

@Component({
  selector: 'cm-attivita-modifica-competenze',
  templateUrl: './attivita-modifica-competenze.component.html',
  styleUrls: ['./attivita-modifica-competenze.component.css']
})
export class AttivitaModificaCompetenze implements OnInit {


  attivita: Attivita;
  addCompetenzeBtnText: string = "Aggiungi competenze";

  attachedCompetenze: Competenza[]; //competenze already added to the activity


  constructor(private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private growler: GrowlerService) { }

  navTitle: string = "Aggiunta competenze ad attività";
  breadcrumbItems = [
    {
      title: "Attività interne",
      location: "../../../"
    },
    {
      title: "Dettaglio attività",
      location: "../"
    },
    {
      title: "Aggiunta competenze ad attività",
      location: "./"
    }
  ];

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      let id = params['id'];

      this.dataService.getAttivitaById(id).subscribe((attivita: Attivita) => {
        this.attivita = attivita;
        this.attachedCompetenze = attivita.competenze;
        this.navTitle = attivita.titolo;
      },
        (err: any) => console.log(err),
        () => console.log('get attivita'));

    });
  }

  addNewCompetenze(competenze: Competenza[]) {

    let updatedCompetenze = [];

    for (let competenza of competenze) {
      updatedCompetenze.push(Number(competenza.id));
    }

    for (let competenza of this.attachedCompetenze) {
      updatedCompetenze.push(Number(competenza.id));
    }


    // Update competenze. PUT /opportunita/{id}/competenze
    this.dataService.updateCompetenze(this.attivita.id, updatedCompetenze)
      .subscribe((status: boolean) => {
        if (status) {
          this.growler.growl('Successo.', GrowlerMessageType.Success);
          this.router.navigate(['definizioni/attivita/detail', this.attivita.id]);
        } else {
          this.growler.growl("Errore", GrowlerMessageType.Danger);
          // this.router.navigate(['attivitainterne/attivita/detail', this.attivita.id]);
        }
      })
  }


}
