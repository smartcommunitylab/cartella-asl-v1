import { Component, OnInit } from '@angular/core';
import { ProfiloCompetenza } from '../../../../shared/classes/ProfiloCompetenza.class';
import { Competenza } from '../../../../shared/classes/Competenza.class';
import { DataService } from '../../../../core/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillsSelectorComponent } from '../../../../skills-selector/skills-selector.component';
import { GrowlerService, GrowlerMessageType } from '../../../../core/growler/growler.service';

@Component({
  selector: 'cm-attivita-gruppo-competenze',
  templateUrl: './attivita-gruppo-competenze.component.html',
  styleUrls: ['./attivita-gruppo-competenze.component.css']
})
export class AttivitaGruppoCompetenze implements OnInit {


  attivitaGruppo;
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
      title: "Attività",
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

      this.dataService.getAttivitaAlternanzaByIdAPI(id)
        .subscribe((attivita) => {
          this.attivitaGruppo = attivita;
          this.attachedCompetenze = this.attivitaGruppo.competenze;
          this.navTitle = attivita.titolo;

        },
          (err: any) => console.log(err),
          () => console.log('get attivita alternanza by id'));

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

    this.attivitaGruppo.competenzeId = updatedCompetenze;

    this.dataService.updateAttivitaAlternanzaById(this.attivitaGruppo.id, this.attivitaGruppo)
      .subscribe((activity: any) => {
          this.growler.growl('Successo.', GrowlerMessageType.Success);
          this.router.navigate(['../'], { relativeTo: this.activeRoute });
      },
        (err: any) => console.log(err),
        () => console.log('error updating attivitaAlternanza'));


  }

}
