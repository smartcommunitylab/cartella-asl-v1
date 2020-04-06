import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { Competenza } from '../../shared/classes/Competenza.class';
import { CompetenzeCancellaModal } from './actions/competenze-cancella-modal.component';
import { GrowlerService, GrowlerMessageType } from '../../core/growler/growler.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPagedCompetenze } from '../../shared/classes/IPagedCompetenze.class';
import { PaginationComponent } from '../../shared/pagination/pagination.component';


@Component({
    selector: 'competenze',
    templateUrl: './competenze.component.html',
    styleUrls: ['./competenze.comoponent.scss']
})

export class CompetenzeComponent implements OnInit {

    @ViewChild('cmPagination') cmPagination: PaginationComponent;

    title: string;
    competenze: Competenza[] = [];
    filtro;
    emptyFilter: boolean = true;
    closeResult: string;
    totalRecords: number = 0;
    pageSize: number = 10;
    filterText: string;

    constructor(
        private dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private growler: GrowlerService
    ) {
        this.filtro = {
            dataInizio: null,
            dataFine: null,
            ricerca: ""

        }
    }
    ngOnInit(): void {
        this.title = 'Lista competenze';
        this.getCompetenzePage(1);

    }

    getCompetenzePage(page: number) {
        this.dataService.getPagedIstitutoCompetenze(this.dataService.istitudeId, this.filtro.ricerca != '' ? this.filtro.ricerca : null,
            (page - 1),
            this.pageSize)
            .subscribe((response: IPagedCompetenze) => {
                this.competenze = response.content;
                this.totalRecords = response.totalElements
            },
                (err: any) => console.log(err), () => console.log('getCompetenze for filtersearch: '));

    }

    filterChanged() {
        this.cmPagination.changePage(1);
        this.getCompetenzePage(1);
    }

    openDetail(competenza) {
        this.router.navigate(['../list/detail', competenza.id], { relativeTo: this.route });
    }
    openModify(competenza) {
        this.router.navigate(['../list/edit', competenza.id], { relativeTo: this.route });
    }
    openCreate() {
        this.router.navigate(['../list/edit'], { relativeTo: this.route });
    }
    openDelete(competenza) {
        const modalRef = this.modalService.open(CompetenzeCancellaModal);
        modalRef.componentInstance.type = "la competenza";
        modalRef.componentInstance.title = "competenza";
        modalRef.result.then((result) => {
            if (result == 'DEL') {
                this.dataService.deleteCompetenzaIstituto(competenza.id).subscribe(
                    (response: boolean) => {
                        if (response) {
                        this.growler.growl('Successo.', GrowlerMessageType.Success);
                        this.getCompetenzePage(1)
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

    pageChanged(page: number) {
        this.getCompetenzePage(page);
    }

    isEmptyFilter() {
        var empty: boolean = true;
        for (var key in this.filtro) {
            if (this.filtro.hasOwnProperty(key) && this.filtro[key]) {
                empty = false;
            }
        }
        return empty;
    }

}