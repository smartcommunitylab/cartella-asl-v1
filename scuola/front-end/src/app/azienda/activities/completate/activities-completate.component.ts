import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, } from '@angular/router';

import { IPagedResults, IPagedAA, TipologiaAzienda, Stato, AttivitaAlternanza } from '../../../shared/interfaces';
import { DataService } from '../../../core/services/data.service';
import { startOfDay, addDays, endOfISOYear, startOfMonth, endOfMonth } from 'date-fns';
import { SorterService } from '../../../core/services/sorter.service';

@Component({
  selector: 'activities-completate',
  templateUrl: './activities-completate.component.html',
  styleUrls: ['./activities-completate.component.scss']
})
export class AttivitaCompletateComponent implements OnInit {

  attivitaAlternanzaList: AttivitaAlternanza[] = [];

  totalRecords: number = 0;
  pageSize: number = 10;
  tipologiaAzienda: TipologiaAzienda[] = [];
  order: string = "primo";
 
  constructor(private sorterService: SorterService, private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit() {
    console.log('AttivitaCompletateComponent')

    this.dataService.getData("tipologiaAzienda").subscribe((data) => {
      this.tipologiaAzienda = data;
      this.getActivitiesInCorso(1);
    });


  }

  getTipo(id: any) {
    for (let tipo of this.tipologiaAzienda) {
      if (tipo.id == id) {
        return tipo.titolo;
      }
    }

  }

  pageChanged(page: number) {
    this.getActivitiesInCorso(page);
  }

  getActivitiesInCorso(page: number) {
    let today: Date = new Date();

    let start: Date = startOfMonth(today);
    // let end: Date = endOfMonth(today);

    console.log('activities-incorso.component.ts' + start + " - ");
    
    this.dataService.getAttivitaAlternanzaForIstitutoAPI('',//start.getTime(),
      null, null, null, true, null, page - 1, this.pageSize) //individuale set to NULL for both single/group activities.
      .subscribe((response: IPagedAA) => {
        this.totalRecords = response.totalElements;
        this.attivitaAlternanzaList = response.content;
      });
  }

}


