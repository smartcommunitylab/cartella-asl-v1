import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Location } from '@angular/common';
import { locale } from 'moment';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'cm-studenti-lista',
  templateUrl: './studenti-lista.component.html',
  styleUrls: ['./studenti-lista.component.scss']
})
export class StudentiListaComponent implements OnInit {
  @ViewChild('cmPagination') cmPagination: PaginationComponent;

  filtro = {
    anno: "3",
    corsodistudio: "",
    classe: "",
    nome: ""
  };
  emptyFilter: boolean = true;

  studenti;
  corsiDiStudio;

  totalRecords: number = 0;
  pageSize: number = 10;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.restoreURLState();
    this.loadFiltersData();
    this.filtra(1);
  }


  filtra(page: number) {
    // this.emptyFilter = this.isEmptyFilter();
    this.dataService.getAttivitaGiornaliereStudenti(this.filtro, (page - 1),  this.pageSize).subscribe((res: any) => {
      this.studenti = res.content;
      this.totalRecords = res.totalElements;
    },
      (err: any) => console.log(err),
      () => console.log('get attivita giornaliere studenti'));
    // this.recreateFilterUrl();
  }

  recreateFilterUrl() {
    let queryParams: any = {};
    if (this.filtro.anno) {
      queryParams.anno = this.filtro.anno;
    }
    if (this.filtro.classe) {
      queryParams.classe = this.filtro.classe;
    }
    if (this.filtro.corsodistudio) {
      queryParams.corsodistudio = this.filtro.corsodistudio;
    }
    if (this.filtro.nome) {
      queryParams.nome = this.filtro.nome;
    }
    const url = this.router
      .createUrlTree([], { relativeTo: this.route, queryParams: queryParams })
      .toString();
    this.location.go(url);
  }

  restoreURLState() {
    this.filtro.anno = this.route.snapshot.queryParamMap.get('anno');
    // set default value of anno.
    if (this.filtro.anno === null || this.filtro.anno === 'undefined' || this.filtro.anno === '') {
      this.filtro.anno = '3';
    }
    this.filtro.corsodistudio = this.route.snapshot.queryParamMap.get('corsodistudio');
    this.filtro.classe = this.route.snapshot.queryParamMap.get('classe');
    this.filtro.nome = this.route.snapshot.queryParamMap.get('nome');
  }

  openStudente(studenteReport) {
    sessionStorage.setItem("studenteReport", JSON.stringify(studenteReport));
    this.router.navigate([studenteReport.studenteId], { relativeTo: this.route });
  }

  loadFiltersData() {
    this.dataService.getCorsiStudio().subscribe((res) => {
      this.corsiDiStudio = res;
      console.log(this.corsiDiStudio);
    });
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

  pageChanged(page: number) {
    this.filtra(page);
  }

  filterChanged() {
    
    if (this.cmPagination.currentPage == 1) {
      this.filtra(1);
    } else {
      this.cmPagination.changePage(1);
    }
    
  }

}
