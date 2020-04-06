import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { DataService } from '../../core/services/data.service'
import { Richiesta } from '../../shared/classes/Richiesta.class'
import { RichiestaDetailsComponent } from './richiesta-details/richiesta-details.component';
import { RefuseRequestConfirmModalComponent } from './modals/refuse-request-confirm-modal/refuse-request-confirm-modal.component';

@Component({
  selector: 'cm-richieste',
  templateUrl: './richieste.component.html',
  styleUrls: ['./richieste.component.scss']
})
export class RichiesteComponent implements OnInit {

  title:string;
  richieste: Richiesta[];
  totalRecords: number = 0;
  pageSize: number = 10;

  constructor(
    private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.title = 'Richieste';
    this.getRichiestePage(1);
    // this.dataService.getRichieste().subscribe((response: Richiesta[]) => {
    //     this.richieste = response;
    //   },
    //   (err: any) => console.log(err),
    //   () => console.log('get richieste list'));
  }
  pageChanged(page: number) {
    this.getRichiestePage(page);
  }

  getRichiestePage(page: number) {
    this.dataService.getRichiestePage((page - 1) * this.pageSize, this.pageSize)
        .subscribe((response) => {
            this.totalRecords = response.totalRecords;
            this.richieste = response.results;
        },
        (err: any) => console.log(err),
        () => console.log('get attivita'));
  }
  openRichiesta = function(richiesta) {
   /* const modalRef = this.modalService.open(RichiestaDetailsComponent, {size: 'lg'});
    modalRef.componentInstance.richiesta = richiesta;
    modalRef.componentInstance.onCreateActivity.subscribe((request) => {
      this.createActivity(request);
    });
    modalRef.componentInstance.onRefuseRequest.subscribe((request) => {
      this.refuseRequest(request);
    });*/
    this.router.navigate(['detail', richiesta.id], {relativeTo: this.route});
  }

  createActivity(request) {
    this.router.navigate(['../../attivita/edit'], {relativeTo: this.route, queryParams: {richiestaid: request.id}});
  }
  refuseRequest(request) {
    const modalRef = this.modalService.open(RefuseRequestConfirmModalComponent);
    modalRef.componentInstance.richiesta = request;
    modalRef.componentInstance.onConfirmRefuse.subscribe((request) => {
      this.dataService.refuseRichiesta(request).subscribe((response: Richiesta) => {
          console.log("Richiesta rifiutata, cosa restituisce la chiamata? Dove vanno a finire le richieste rifiutate?");
        },
        (err: any) => console.log(err),
        () => console.log('refuse request'));
    });
  }

}
