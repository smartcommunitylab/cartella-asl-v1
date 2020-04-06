import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { DataService } from '../core/services/data.service'
import { ProfiloCompetenza } from '../shared/classes/ProfiloCompetenza.class';
import { Competenza } from '../shared/classes/Competenza.class';
import { CompetenzaDetailModalComponent } from './modals/competenza-detail-modal/competenza-detail-modal.component';
import { Attivita } from '../shared/classes/Attivita.class';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { IPagedCompetenze } from '../shared/classes/IPagedCompetenze.class';

@Component({
  selector: 'cm-skills-selector',
  templateUrl: './skills-selector.component.html',
  styleUrls: ['./skills-selector.component.css']
})
export class SkillsSelectorComponent implements OnInit {

  @Input() attachedCompetenze: Competenza[];
  @Input() addButtonText: string;
  @Output() onNewCompetenzeAddedListener = new EventEmitter<Competenza[]>();
  
  @ViewChild('cmPagination') cmPagination: PaginationComponent;

  totalRecords: number = 0;
  pageSize: number = 10;
  
  competenzeProfili: ProfiloCompetenza[];
  competenze: Competenza[];

  selectedNewCompetenze: Competenza[];

  searchCompetenzaTxt:string;



  constructor(private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute) {
      this.selectedNewCompetenze = [];
  }

  ngOnInit() {
    this.getCompetenze(1);
  }
  ngOnChanges(changes) {
    this.mergeCompetenze();
  }
  pageChanged(page: number) {
    this.getCompetenze(page);
  }

  getCompetenze(page) {
    this.dataService.getCompetenzeAPI(this.searchCompetenzaTxt, (page - 1), this.pageSize).subscribe((response: IPagedCompetenze) => {
      // this.attachedCompetenze = response.content;
      this.competenze = response.content;
      this.totalRecords = response.totalElements;
      this.mergeCompetenze();
    });
  }

  mergeCompetenze() {
    if (this.competenze && this.attachedCompetenze) {
      this.competenze.forEach(element => {
        if (this.attachedCompetenze.find(function (el) { return el.id == element.id; })) {
          element['disabled'] = true;
          element['selected'] = true;
        }
        if (this.selectedNewCompetenze.find(function (el) { return el.id == element.id; })) {
          element['selected'] = true;
        }
      });
    }
  }

  searchCompetenza(txt) {
    this.cmPagination.changePage(1);
    //this.cmPagination.pages = [];
    this.getCompetenze(0);
  }

  toggleCompetenza(competenza) {
    if (competenza.disabled) return
    if (competenza.hasOwnProperty('selected')) {
      competenza.selected = !competenza.selected;
    } else {
      competenza.selected = true;
    }
    if (competenza.selected) {
      this.selectedNewCompetenze.push(competenza);      
    } else {
      this.selectedNewCompetenze.splice(this.selectedNewCompetenze.indexOf(competenza), 1);
    }
  }

  openDetailCompetenza(competenza, $event) {
    if ($event) $event.stopPropagation();
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, {size: "lg"});
    modalRef.componentInstance.competenza = competenza;
  }

  addCompetenze() {
    this.onNewCompetenzeAddedListener.emit(this.selectedNewCompetenze);
  }

  deleteCompetenza(competenza) {
    this.competenze[this.findById(this.competenze, competenza)].selected = false;
    this.selectedNewCompetenze.splice(this.selectedNewCompetenze.indexOf(competenza), 1);
  }

  findById(list, competenza): number {
    let i;
    list.forEach(comp => {
      if(comp.id == competenza.id) {
        i = list.indexOf(comp);
      }
    });
    return i;
  }

  //TODO: pagination of skills

}
