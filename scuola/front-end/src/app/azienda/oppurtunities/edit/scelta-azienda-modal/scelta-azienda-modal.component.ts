import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { Azienda } from '../../../../shared/interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';


@Component({
  selector: 'cm-scelta-azienda-modal',
  templateUrl: './scelta-azienda-modal.component.html',
  styleUrls: ['./scelta-azienda-modal.component.css']
})


export class SceltaAziendaModalComponent implements OnInit {

  
  @Output() onAdd = new EventEmitter();
  //ricercaClicked: boolean = false;
  nome: string;
  // address: string;
  // distance: number;
  // id: string;
  // partita_iva: string;
  // ricercaSemplice: boolean = true;
  aziende: Azienda[];
  filteredAziende : Azienda[] = [];
  search = new Subject<any>();
  searching: boolean;

  constructor(private dataService: DataService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.dataService.getListaAziende().subscribe((response) => {
      this.aziende = response;
    });

    this.search.subscribe(()=>{
      this.searching = true;
    })

    this.search.debounceTime(400).subscribe((text) => {
      this.filterAzienda();
      this.searching = false;
    });
  }

  // ricercaChange() {
  //     this.ricercaSemplice = !this.ricercaSemplice;
  // }
  filterAzienda () {

      this.filter();
  }

  searchAziende() {
    this.search.next(this.nome);
  }

  filter() {
    this.filteredAziende = [];
    if (this.nome != null && this.nome != "") 
    {
      this.aziende.forEach(azienda => {
        if(azienda.nome.toUpperCase().includes(this.nome.toUpperCase())) {
          this.filteredAziende.push(azienda);
        }
      })
      
    }
  }

  addAzienda(azienda) {
    this.onAdd.emit(azienda);
    this.activeModal.close('Close click')
  }

}
