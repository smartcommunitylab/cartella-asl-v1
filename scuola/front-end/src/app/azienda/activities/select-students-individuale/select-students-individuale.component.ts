import { Component, OnInit } from '@angular/core';
import { Attivita } from '../../../shared/classes/Attivita.class';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';

@Component({
  selector: 'cm-select-students-individuale-incorso',
  templateUrl: './select-students-individuale.component.html',
  styleUrls: ['./select-students-individuale.component.scss']
})
export class SelectStudentsIndividuale implements OnInit {


  attivita: Attivita;
  attachedStudentButtonText: string = "Conferma";
  warningText: string = "Attenzione, non è possibile annullare questa operazione una volta confermata.";
  popupTitle: string = "Segnare come completato il corso"
  popupText: string = "Sei sicuro di voler segnare come da completare il corso";
  navTitle: string = "Completa esperienza ad attività";
  oreNonValidate: string = "Attenzione, ci sono ore non validate. Si prega di validare le ore per completare l'attività.";
  blockCompleteOperation: boolean = false;
  attachedAttivitaInfoText: string;
  attachedStudenti: any; //students map with ore svolta and esperienza id.
  corso;
  breadcrumbItems = [
    {
      title: "Completa studente ad attività",
      location: "../"
    },
    {
      title: "Dettaglio attività",
      location: "../../"
    },
    {
      title: "Aggiunta competenze ad attività",
      location: "./"
    }
  ];


  constructor(private dataService: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private growler: GrowlerService) {}
 
  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getAttivitaAlternanzaById(id).subscribe(attivita => {
        this.corso = attivita;
     		this.attachedAttivitaInfoText = this.corso.titolo + " - " + this.corso.corso;
        this.dataService.getAttivitaGiornalieraCalendario(id).subscribe((studenti: any) => {
          this.attachedStudenti = studenti;
          // check for ore non validate in giornate.
          for (var key in this.attachedStudenti) {
            if (this.attachedStudenti[key].giornate.length > 0) {
              for (var day in this.attachedStudenti[key].giornate) {
                if (!this.attachedStudenti[key].giornate[day].verificata) {
                  this.warningText = this.oreNonValidate;
                  this.blockCompleteOperation = true;
                  break;
                }
              }
            } else {
              this.warningText = this.oreNonValidate;
              this.blockCompleteOperation = true
              break;
            }
          }
        },
          (err: any) => console.log(err),
          () => console.log('get attivita giornaliera calendario by id'));
      },
        (err: any) => console.log(err),
        () => console.log('get attivita alternanza by id'));

    });
  }

  updateAttivita(upldatedES) {
    this.activeRoute.params.subscribe(params => {
      let id = params['id'];
      // Completa attivta'. PUT api/completa/attivitaAlternanza/{id}
      this.dataService.completaAttivitaAlternanza(id, upldatedES)
        .subscribe((status: boolean) => {
          if (status) {
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['azienda/attivita/incorso/individuali']);
          } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          }
        })
    });
  }


}

