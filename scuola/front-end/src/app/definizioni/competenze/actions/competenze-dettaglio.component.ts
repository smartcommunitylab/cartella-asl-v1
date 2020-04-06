import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrowlerService, GrowlerMessageType } from '../../../core/growler/growler.service';
import { CompetenzeCancellaModal } from './competenze-cancella-modal.component';
import { Location } from '@angular/common';
import { Competenza } from '../../../shared/classes/Competenza.class';

@Component({
  selector: 'Competenze-dettaglio',
  templateUrl: './competenze-dettaglio.html',
  styleUrls: ['./competenze-dettaglio.scss']
})
export class CompetenzeDettaglio {
  competenza: Competenza;
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal,
    private growler: GrowlerService,
    private location: Location) { }


  navTitle: string = "Dettaglio competenza";
  breadcrumbItems = [
    {
      title: "List competenze",
      location: "../../"
    },
    {
      title: "Dettaglio competenza",
      location: "./"
    }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getIstiutoCompetenzaDetail(id).subscribe(response => {
        this.competenza = response;
      },
        (err: any) => console.log(err),
        () => console.log('get competenza for istituto'));
    });
  }

  back() {
    this.location.back();
  }


  deleteCompetenza() {
    const modalRef = this.modalService.open(CompetenzeCancellaModal);
    modalRef.componentInstance.type = "la competenza";
    modalRef.componentInstance.title = "competenza";
    modalRef.result.then((result) => {
      if (result == 'DEL') {
        this.dataService.deleteCompetenzaIstituto(this.competenza.id).subscribe(
          (response: boolean) => {
            if (response) { 
            this.growler.growl('Successo.', GrowlerMessageType.Success);
            this.router.navigate(['../../list'], { relativeTo: this.route });
            } else {
            this.growler.growl("Errore", GrowlerMessageType.Danger);
            }
          },
          (err: any) => {
            console.log(err);
            this.growler.growl("Errore", GrowlerMessageType.Danger);
          },
          () => {
            console.log('delete competenza')
          }
        );

      }
    });
  }

  editCompetenza() {
    this.router.navigate(['../../edit', this.competenza.id], { relativeTo: this.route });
  }

}