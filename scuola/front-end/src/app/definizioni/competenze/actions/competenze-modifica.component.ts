import { Component } from '@angular/core';

import { DataService } from '../../../core/services/data.service'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Competenza } from '../../../shared/classes/Competenza.class';


@Component({
  selector: 'competenze-modifica',
  templateUrl: './competenze-modifica.html',
  styleUrls: ['./competenze-modifica.scss']

})
export class CompetenzeModifica implements OnInit {

  competenza: Competenza;
  titolo: string;
  newConoscenza: string;
  newAbilita: string;
  isNewActivity:boolean = false;
  forceErrorDisplay:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService,
  ) { }

  navTitle: string = "Modifica competenza";
  breadcrumbItems = [
    {
      title: "List competenze",
      location: "../../"
    },
    {
      title: "Modifica competenza",
      location: "./"
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.dataService.getIstiutoCompetenzaDetail(id).subscribe(response => {
          this.competenza = response;
          this.initUI();
        },
          (err: any) => console.log(err),
          () => console.log('get competenza for istituto'));

      } else {
        this.initUI();
      }
    });
  }

  addConoscenza() {
    if (this.newConoscenza) {
      this.competenza.conoscenze.push(this.newConoscenza);
      this.newConoscenza = '';
    }    
  }

  deleteConoscenza(index) {	
    this.competenza.conoscenze.splice(index, 1);
  }

  addAbilita() {
    if (this.newAbilita) {
      this.competenza.abilita.push(this.newAbilita);
      this.newAbilita = '';
    }
  }

  deleteAbilita(index) {
    this.competenza.abilita.splice(index, 1);
  }
      
  modifica() {

    if (this.allValidated()) { //submission.

      if (this.isNewActivity) {
        this.dataService.addIstitutoCompetenza(this.dataService.istitudeId, this.competenza).subscribe((inserted: Competenza) => {
          if (inserted) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['../../list'], { relativeTo: this.route });
          } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          }
        }
        );
      } else {
        this.dataService.updateIstitutoCompetenza(this.dataService.istitudeId, this.competenza).subscribe((inserted: Competenza) => {
          if (inserted) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['../../list'], { relativeTo: this.route });
          } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          }
        }
        );
      }

    } else {
      //probably never used: allValidated decides disabled status of save
      this.forceErrorDisplay = true;
      this.growler.growl('Compila i campi necessari', GrowlerMessageType.Warning);
    }

  }

  cancel() {
    if (this.isNewActivity) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../list/detail', this.competenza.id], { relativeTo: this.route });
    }
  }

  initUI() {
    if (this.competenza) {
      this.titolo = "Modifica";
    } else {
      this.isNewActivity = true;
      this.titolo = "Crea";
      this.competenza = new Competenza();
      this.competenza.conoscenze = [];
      this.competenza.abilita = [];
      this.breadcrumbItems[1].title = "Crea competenza";
      this.navTitle = "Crea competenza";
    }
  }

  allValidated() {
    return this.competenza.titolo;
  }

}