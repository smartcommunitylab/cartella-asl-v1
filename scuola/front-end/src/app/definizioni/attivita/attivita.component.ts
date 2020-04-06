import { Component, OnInit, ViewChild } from '@angular/core';
import { startOfDay, addDays, endOfISOYear, startOfMonth, endOfMonth, addISOYears } from 'date-fns';
import { DataService } from '../../core/services/data.service'
import { Attivita } from '../../shared/classes/Attivita.class'
import { Richiesta } from '../../shared/classes/Richiesta.class'
import { AttivitaDettaglio } from './actions/attivita-dettaglio.component';
import { AttivitaModifica } from './actions/attivita-modifica.component';
import { AttivitaCancellaModal } from './actions/attivita-cancella-modal.component';
import { GrowlerService, GrowlerMessageType } from '../../core/growler/growler.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operator/filter';
import { config } from '../../config';
import { IPagedCorsoInterno } from '../../shared/classes/IPagedCorsoInterno.class';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import * as moment from 'moment';
import { TipologiaInterno } from '../../shared/classes/TipologiaInterna.class';


@Component({
    selector: 'attivita',
    templateUrl: './attivita.component.html',
    styleUrls: ['./attivita.comoponent.scss']
})

export class AttivitaComponent implements OnInit {

    @ViewChild('cmPagination') cmPagination: PaginationComponent;

    title: string;
    attivita: Attivita[] = [];
    filtro;
    emptyFilter:boolean = true;
    closeResult: string;
    totalRecords: number = 0;
    pageSize: number = 10;
    filterText: string;
    start: Date;
    archivioView: boolean;
    tipologie: TipologiaInterno[];
    allTipology: any = [];
    filterTipology: number = 0;

    filterDatePickerConfig = {
        locale: 'it',
        firstDayOfWeek: 'mo'
    };

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
        let today: Date = new Date();
        this.start = startOfMonth(today);
        this.title = 'Lista attività';
        console.log(this.route);
        this.dataService.getData("tipologiaInterna").subscribe(tipologie => {
            this.tipologie = tipologie;

             // default selectAll.
            for (let tipo of this.tipologie) {
                this.allTipology.push(tipo.id);
            }
            
             // hack for adding additional option for selectALL.
            let allOption: TipologiaInterno = { id: 0, titolo: "TUTTI", selected: true };
            this.tipologie.push(allOption);
            
            this.getAttivitaPage(1);
        });
        
    }
    openDetail(attivita) {
        this.router.navigate(['../detail', attivita.id], { relativeTo: this.route });
    }
    openModify(attivita) {
        this.router.navigate(['../edit', attivita.id], { relativeTo: this.route });
    }
    openCreate() {
        this.router.navigate(['../edit'], { relativeTo: this.route });
    }
    openDelete(attivita) {
        const modalRef = this.modalService.open(AttivitaCancellaModal);
        modalRef.componentInstance.type = "l'attivita";
        modalRef.componentInstance.title = "attivita";
        modalRef.result.then((result) => {
          if (result == 'DEL') {
            this.dataService.deleteCorsoInterno(attivita.id).subscribe(
              (response: boolean) => {
                
                if (response) {
                  this.growler.growl('Successo.', GrowlerMessageType.Success);
                  this.getAttivitaAttivePage(1)
                } else {
                  this.growler.growl("Errore", GrowlerMessageType.Danger);
                }
    
              },
              (err: any) => console.log(err),
              () => console.log('delete attivita')
            );
    
          }
        });
    }

    filterChanged() {
        // this.cmPagination.pages = [];
        this.cmPagination.changePage(1);
        this.getAttivitaAttivePage(1);
    }

    pageChanged(page: number) {
        this.getAttivitaPage(page);
    }
    getAttivitaPage(page: number) {
        if (this.route.snapshot.url[0].path.indexOf('incorso') >= 0) {
            this.archivioView = false;
            this.getAttivitaAttivePage(page)
        } else if (this.route.snapshot.url[0].path.indexOf('archivio') >= 0) {
            // archivio.
            this.archivioView = true;

            let today: Date = new Date();
            if (this.filtro.dataInizio == null) {
                let start: Date = addISOYears(today, -1);
                this.filtro.dataInizio = moment.unix(start.getTime() / 1000);
            }
            if (this.filtro.dataFine == null) {
                let end: Date = startOfMonth(today);
                this.filtro.dataFine = moment.unix(end.getTime() / 1000);
            }            
            
            this.getAttivitaAttivePage(page);
            
        }
    }
    getAttivitaArchivioPage(page: number) {
        
        this.dataService.getAttivitaArchivioPage((page - 1) * this.pageSize, this.pageSize)
            .subscribe((response) => {
                this.totalRecords = response.totalRecords;
                this.attivita = response.results;
            },
                (err: any) => console.log(err),
                () => console.log('get attivita'));
    }

    getAttivitaAttivePage(page: number) {
        this.emptyFilter = this.isEmptyFilter();

        let filterStartDate = this.start.getTime();
        if (this.filtro.dataInizio) {
            filterStartDate = this.filtro.dataInizio.toDate().getTime();
        }

        let filterEndDate = null;

        if (this.filtro.dataFine) {
            filterEndDate = this.filtro.dataFine.toDate().getTime();
        }

        this.dataService.getPagedCorsoInterno(this.dataService.istitudeId,
            "",//filterStartDate,
            filterEndDate,
            (this.filterTipology == null || this.filterTipology == 0) ? this.allTipology : [this.filterTipology],
            this.filtro.ricerca != '' ? this.filtro.ricerca : null,
            (page - 1),
            this.pageSize)
            .subscribe((response: IPagedCorsoInterno) => {
                this.attivita = response.content;
                this.totalRecords = response.totalElements
            },
                (err: any) => console.log(err), () => console.log('getCorsoInterno for filtersearch: '));


    }

    setSelectedTipo(selectElement) {

        for (var i = 0; i < selectElement.options.length; i++) {
          var optionElement = selectElement.options[i];
          var optionModel = this.tipologie[i];
    
          if (optionElement.selected == true) {
            optionModel.selected = true;
            this.filterTipology = optionModel.id;
          } else {
            optionModel.selected = false;
          }
        }
    }
    
    getTitoloTipo(tipoId: any) {
        for (let tipo of this.tipologie) {
          if (tipo.id == tipoId) {
            return tipo.titolo;
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