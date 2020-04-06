import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { PianoAlternanza } from '../../shared/classes/PianoAlternanza.class'
import {PianificaCancellaModal } from './actions/cancella-piano-modal/pianifica-cancella-modal.component'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operator/filter';
import { NewPianoModalComponent } from './actions/new-piano-modal/new-piano-modal.component';
import { PianificaCloneModal } from './actions/pianifica-clone-modal/pianifica-clone-modal.component';
import { Location } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
    selector: 'pianifica',
    templateUrl: './pianifica.component.html',
    styleUrls: ['./pianifica.comoponent.scss']
})

export class PianificaComponent implements OnInit {


    title: string;
    pianiAlternanza: PianoAlternanza[];
    On="On";
    Off="Off";
    filtro;
    closeResult: string;
    totalRecords: number = 0;
    pageSize: number = 10;
    corsiStudio;

    isArchivio:boolean = false;


    filterDatePickerConfig = {
        locale: 'it',
        firstDayOfWeek: 'mo'
    };

    @ViewChild('cmPagination') private cmPagination: PaginationComponent;

    constructor(
        private dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: NgbModal
    ) {
        this.filtro = {
            inUso: '',
            corsoStudio: ''

        }
    }
    ngOnInit(): void {
        this.title = 'Lista piani';
        console.log(this.route);
        this.isArchivio = !(this.route.snapshot.url[0].path.indexOf('incorso') >= 0);
        
        //Restore filter states from reload
        var inUsoRestore = this.route.snapshot.queryParamMap.get('inuso');
        this.filtro.inUso = inUsoRestore;
        var corsoStudioId = this.route.snapshot.queryParamMap.get('corsostudio');
        if (!corsoStudioId) {
            this.getPianiPage(1);
        }
        
        this.dataService.getCorsiStudio().subscribe((response) => {
            this.corsiStudio = response;
            if (corsoStudioId) {
                this.filtro.corsoStudio = corsoStudioId;
                this.getPianiPage(1);
            }
        },
        (err: any) => console.log(err),
        () => console.log('get corsi studio'));
        
    }
    openDetail(piano: PianoAlternanza) {
        this.router.navigate(['../detail', piano.id], { relativeTo: this.route });
    }
    openCreate() {        
        const modalRef = this.modalService.open(NewPianoModalComponent);   
        modalRef.componentInstance.corsiStudio = this.corsiStudio;
        if (this.filtro.corsoStudio) {
            modalRef.componentInstance.corsoStudioId = this.filtro.corsoStudio;
        }
        modalRef.componentInstance.newPianoListener.subscribe((piano) => {
            this.dataService.createPiano(piano).subscribe((pianoCreated) => {
                // let initChecker = 0;
                // for (let index = 0; index < 3; index++) {
                //     pianoCreated.anniAlternanza[index].oreTotali = piano.anniAlternanza[index].oreTotali;
                //     this.dataService.updatePianoAnnoOre(pianoCreated.anniAlternanza[index]).subscribe((piano) => {
                //         initChecker++;
                //         if (initChecker == 3) {
                //             this.getPianiPage(1);
                //             this.cmPagination.changePage(1);
                //         }
                //     });
                // }
                
                this.getPianiPage(1);
                this.cmPagination.changePage(1);
                
            });
        });

    }
    openDelete(piano) {
        const modalRef = this.modalService.open(PianificaCancellaModal);
        modalRef.componentInstance.piano = piano;
        modalRef.componentInstance.onDelete.subscribe((res) => {
            this.pianiAlternanza.splice(this.pianiAlternanza.indexOf(piano), 1);
            this.totalRecords--;
        });
    }
    clone(piano) {
        const modalRef = this.modalService.open(PianificaCloneModal);
        modalRef.componentInstance.piano = piano;
        modalRef.componentInstance.onCloneConfirm.subscribe((res) => {
            this.dataService.clonePiano(piano).subscribe((piano) => {
                this.getPianiPage(1);
                this.cmPagination.changePage(1);
            });
        });
    }
    cerca() {
        this.getPianiPage(1);
        this.cmPagination.changePage(1);
        this.recreateFilterUrl();      
    }

    pageChanged(page: number) {
        this.getPianiPage(page);
    }
    getPianiPage(page: number) {
        this.dataService.getPianiPage((page - 1), this.isArchivio, this.filtro.corsoStudio)
            .subscribe((response) => {
                this.totalRecords = response.results.totalElements;
                this.pianiAlternanza = response.results.content;
            }
            ,
            (err: any) => console.log(err),
            () => console.log('get piani attivi'));
    }

    getCorsoDiStudioString(corsoStudioId) {
        if (this.corsiStudio) {
            let rtn = this.corsiStudio.find(data => data.courseId == corsoStudioId);
            if (rtn) return rtn.titolo;
            return corsoStudioId;
        }
    }

    recreateFilterUrl() {
        let queryParams:any = {};
        if (this.filtro.corsoStudio) {
            queryParams.corsostudio = this.filtro.corsoStudio;
        }
        if (this.filtro.inUso) {
            queryParams.inuso = this.filtro.inUso;
        }
        const url = this.router
            .createUrlTree([], {relativeTo: this.route, queryParams: queryParams})
            .toString();
        this.location.go(url);  
    }    

}