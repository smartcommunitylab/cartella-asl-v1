import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Richiesta } from '../../../shared/classes/Richiesta.class';
import { RefuseRequestConfirmModalComponent } from '../modals/refuse-request-confirm-modal/refuse-request-confirm-modal.component';

@Component({
  selector: 'richiesta-details',
  templateUrl: './richiesta-details.component.html',
  styleUrls: ['./richiesta-details.component.scss'],
})
export class RichiestaDetailsComponent implements OnInit {

  richiesta: Richiesta;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NgbModal) {}


  navTitle:string = "Dettaglio richiesta";
  breadcrumbItems = [
    {
      title: "Richieste",
      location: "../../"
    },
    {
      title: "Dettaglio richiesta",
      location: "./"
    }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getRichiestaById(id).subscribe((richiesta: Richiesta) => {
        this.richiesta = richiesta;
        this.navTitle = richiesta.titolo;
      },
        (err: any) => console.log(err),
        () => console.log('get richiesta'));
    });    
  }

  refuseRequest = function() {
    const modalRef = this.modalService.open(RefuseRequestConfirmModalComponent);
    modalRef.componentInstance.richiesta = this.richiesta;
    modalRef.componentInstance.onConfirmRefuse.subscribe((request) => {
      this.dataService.refuseRichiesta(request).subscribe((response: Richiesta) => {
          console.log("Richiesta rifiutata, cosa restituisce la chiamata? Dove vanno a finire le richieste rifiutate?");
        },
        (err: any) => console.log(err),
        () => console.log('refuse request'));
    });
  }
  createActivity() {
    this.router.navigate(['../../../attivita/edit'], {relativeTo: this.route, queryParams: {richiestaid: this.richiesta.id}});
  }

}
