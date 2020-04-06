import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, } from '@angular/router';

import { EsperienzaSvolta, IPagedES, TipologiaAzienda, Stato } from '../../../shared/interfaces';
import { DataService } from '../../../core/services/data.service';
import { startOfMonth } from 'date-fns';
import { SorterService } from '../../../core/services/sorter.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'activities-incorso-individuali',
  templateUrl: './activities-incorso-individuali.component.html',
  styleUrls: ['./activities-incorso-individuali.component.scss']
})
export class AttivitaIncorsoIndividualiComponent implements OnInit {

  @ViewChild('cmPagination') cmPagination: PaginationComponent;
  @Input() esperienzaSvolta: EsperienzaSvolta[] = [];

  totalRecords: number = 0;
  pageSize: number = 10;
  tipologiaAzienda: TipologiaAzienda[] = [];
  status: Stato[] = [];
  nomeStudente: string;

  constructor(private sorterService: SorterService, private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit() {

    console.log('AttivitaIncorsoIndividualiComponent');
     
    this.dataService.getData("tipologiaAzienda").subscribe((data) => {
      this.tipologiaAzienda = data;
      this.dataService.getData("statoAttivita").subscribe((sData) => {
         
        this.status = sData;
        this.getActivitiesInCorso(1);
      });
    });


  }

  getTipo(id: any) {
    for (let tipo of this.tipologiaAzienda) {
      if (tipo.id == id) {
        return tipo.titolo;
      }
    }

  }

  getStato(id: any) {
    for (let stato of this.status) {
      if (stato.id == id) {
        return stato.titolo;
      }
    }

  }

  pageChanged(page: number) {
    this.getActivitiesInCorso(page);
  }

  filterChanged() {
    this.cmPagination.changePage(1);
    this.getActivitiesInCorso(1);
  }

  getActivitiesInCorso(page: number) {
    let today: Date = new Date();

    let start: Date = startOfMonth(today);
    // let end: Date = endOfMonth(today);

    console.log('activities-incorso.component.ts' + start + " - ");

    this.dataService.getEsperienzaSvoltaAPI('',//start.getTime(),
      null, null, null, null,false, this.nomeStudente, page - 1, this.pageSize)
      .subscribe((response: IPagedES) => {
        this.totalRecords = response.totalElements;
        this.esperienzaSvolta = response.content;
      });
  }
  
}


