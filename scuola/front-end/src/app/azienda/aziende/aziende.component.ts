import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AziendaCancellaModal } from './actions/azienda-cancella-modal.component';
import { GrowlerService, GrowlerMessageType } from '../../core/growler/growler.service';

@Component({
    selector: 'aziende',
    templateUrl: './aziende.component.html',
    styleUrls: ['./aziende.comoponent.scss']
})

export class AziendeComponent implements OnInit {

    @ViewChild('cmPagination') cmPagination: PaginationComponent;

    title: string;
    aziendeResult = {
        list: [],
        totalRecords: 0,
        selectedAzienda: undefined
    }
    pageSize: number = 10;

    filter = {
        text: '',
        pIva: ''
    }

    constructor(private dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private growler: GrowlerService,
    ) {

    }
    ngOnInit(): void {
        this.title = 'Lista aziende';
        this.getAziendePage(1);

    }

    getAziendePage(page: number) {
        this.dataService.getAziende((page - 1), this.pageSize, this.filter)
            .subscribe((response) => {
                this.aziendeResult.totalRecords = response.totalElements;
                this.aziendeResult.list = response.content;
            },
                (err: any) => console.log(err),
                () => console.log('get aziende list'));
    }

    filterChanged() {
        this.cmPagination.changePage(1);
        this.getAziendePage(1);
    }

    openDetail(azienda) {
        this.router.navigate(['../list/details', azienda.id], { relativeTo: this.route });
    }
    openModify(azienda) {
        this.router.navigate(['../list/edit', azienda.id], { relativeTo: this.route });
    }
    openCreate() {
        this.router.navigate(['../list/edit', 0], { relativeTo: this.route });
    }
    openDelete(azienda) {
        const modalRef = this.modalService.open(AziendaCancellaModal);
        modalRef.componentInstance.type = "l'azienda";
        modalRef.componentInstance.title = "azienda";
        modalRef.result.then((result) => {
          if (result == 'DEL') {
            this.dataService.deleteAzienda(azienda.id).subscribe(
              (response: boolean) => {
                
                if (response) {
                  this.growler.growl('Successo.', GrowlerMessageType.Success);
                  this.getAziendePage(1);
                } else {
                  this.growler.growl("Errore", GrowlerMessageType.Danger);
                }
    
              },
              (err: any) => console.log(err),
              () => console.log('delete azienda')
            );
    
          }
        });
    }

    pageChanged(page: number) {
        this.getAziendePage(page);
    }
}