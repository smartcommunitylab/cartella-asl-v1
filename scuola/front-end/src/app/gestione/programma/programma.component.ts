import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { ProgrammazioneService } from '../../core/services/programmazione.service'
import { PianoAlternanza } from '../../shared/classes/PianoAlternanza.class'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operator/filter';
import { StatoProgramma } from '../../shared/classes/StatoProgramma.class';

@Component({
    selector: 'programma',
    templateUrl: './programma.component.html',
    styleUrls: ['./programma.comoponent.scss']
})

export class ProgrammaComponent implements OnInit {

    title: string;
    pianiAlternanza: PianoAlternanza[];
    filtro;
    closeResult: string;
    totalRecords: number = 0;
    pageSize: number = 10;
    corsiStudio;
    stati=[];
    selectedStato;
    selectedCorso;
    
    filterDatePickerConfig = {
        locale: 'it',
        firstDayOfWeek: 'mo'
    };

    constructor(
        private dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private programmaService: ProgrammazioneService
    ) {
        this.filtro = {};
    }
    ngOnInit(): void {
        this.title = 'Lista programmazioni';
        this.stati=this.programmaService.getArrayStati();
        this.getPianiPage(1);
        this.dataService.getCorsiStudio().subscribe((response) => {
            this.corsiStudio = response;
            console.log(response);
        },
        (err: any) => console.log(err),
        () => console.log('get corsi studio'));
    }
    openDetail(piano: PianoAlternanza) {
        this.router.navigate(['../detail', piano.id], { relativeTo: this.route });
    }

    cerca() {
        this.getPianiPage(1);
    }

    pageChanged(page: number) {
        this.getPianiPage(page);
    }
    getPianiPage(page: number) {
        if (this.route.snapshot.url[0].path.indexOf('incorso') >= 0) {
            this.getPianiAttiviPage(page)
        } else {
            this.getPianiArchivioPage(page)
        }
    }
    getPianiAttiviPage(page: number) {
        this.dataService.getPianiPerProgrammiAttiviPage((page - 1), this.pageSize, this.programmaService.getActualYear(),   this.filtro.corsoStudio ? this.filtro.corsoStudio.courseId : "",this.filtro.stato ? this.filtro.stato.id : "",)
            .subscribe((response) => {
                this.totalRecords = response.results.totalElements;
                this.pianiAlternanza=response.results.content;
               },
            (err: any) => console.log(err),
            () => console.log('get programmi archivio'));
    }

    getPianiArchivioPage(page: number) {
        this.dataService.getPianiPerProgrammiArchivioPage((page - 1), this.pageSize, this.programmaService.getActualYear(), this.filtro.corsoStudio.id ? this.filtro.corsoStudio: "")
            .subscribe((response) => {
                this.totalRecords = response.results.totalElements;
                this.pianiAlternanza=response.results.content;
            }
            ,
            (err: any) => console.log(err),
            () => console.log('get programmi attivi'));

    }


    selectCorsoFilter() {
        this.getPianiPage(1);
    }
  
     selectStatoFilter() {
        this.getPianiPage(1);
    }
    //calculate state of piano and if it is "in corso", "in scadenza" or scaduto
    getStatoString(piano){
        switch(this.programmaService.getStatoProgramma(piano)) {
            case (StatoProgramma.inCorso): { 
                return "In Corso";
            }
            case (StatoProgramma.inScadenza): { 
                return "In Scadenza";
            }
            case (StatoProgramma.scaduto): { 
                return "Scaduto";
            }
            case (3): { 
                return "Creato";
            }
            default:{
                return "errore"
            }
        }
    }
    getStatoValue(piano){
        switch(this.programmaService.getStatoProgramma(piano)) {
            case (StatoProgramma.inCorso): { 
                return 0;
            }
            case (StatoProgramma.inScadenza): { 
                return 1;
            }
            case (StatoProgramma.scaduto): { 
                return 2;
            }
            case (3): { 
                return 3;
            }
            default:{
                return 0
            }
        }
    }
    getStateClass(piano) {
        switch(this.getStatoValue(piano)) {
            case (StatoProgramma.inCorso): { 
                return 'piano-corso'
            }
            case (StatoProgramma.inScadenza): { 
                return 'piano-scadenza'
            }
            case (StatoProgramma.scaduto): { 
                return 'piano-scaduto'
            }
            case 3: { 
                return 'piano-creato'
            }
            default: {
                return ''
            }
        }
    }
    isEmptyFilter() {
        var empty:boolean = true;
        for(var key in this.filtro) {
            if (this.filtro.hasOwnProperty(key) && this.filtro[key]) {
                empty = false;
            }
        }
        return empty;
    }
}