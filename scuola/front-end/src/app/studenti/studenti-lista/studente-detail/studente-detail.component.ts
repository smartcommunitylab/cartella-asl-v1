import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpportunitiesModal } from './opportunities-modal/opportunities-modal.component'

@Component({
  selector: 'cm-studente-detail',
  templateUrl: './studente-detail.component.html',
  styleUrls: ['./studente-detail.component.css']
})
export class StudenteDetailComponent implements OnInit {

  navTitle: string = "Dettaglio studente";
  breadcrumbItems = [
    {
      title: "Lista studenti",
      location: "../",
    },
    {
      title: "Dettaglio studente",
      location: "./"
    }
  ];

  filtro = {
    orderBy: 1,
    viewOnly: ""
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) { }

  studente:any = {};
  tipologie;

  ngOnInit() {
    this.studente = JSON.parse(sessionStorage.getItem("studenteReport"));

    this.route.params.subscribe(params => {
      let id = params['id'];
      if (this.studente.studenteId != id) { //check for url manipulations
        this.router.navigate(['../'], { relativeTo: this.route });
        return;
      }
      this.dataService.getAttivitaGiornaliereStudenteById(id).subscribe((attivita) => {
        this.studente["attivita"] = attivita;
        this.orderAttivita(this.filtro.orderBy);
      },
        (err: any) => console.log(err),
        () => console.log('get attivita giornaliera studente by id'));
    });
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologie = res;
    });
  }

  stati = [
    "Completato",
    "Non completato",
    "Da fare",
    "In corso"
  ]
  getStatoTitle(index) {
    return this.stati[index];
  }
  getTipologiaTitle(id) {
    if (!this.tipologie) return id;
    return this.tipologie.find(tipologia => tipologia.id == id).titolo;
  }
  isActivityVisibile(stato) {
    if (this.filtro.viewOnly) {
      return stato == this.filtro.viewOnly;
    } else {
      return true;
    }
  }
  openOpportunity(attivita) {
    //open modal with opportunity
    const modalRef = this.modalService.open(OpportunitiesModal, { size: "lg" });
    modalRef.componentInstance.attivita = attivita;
  }
  orderAttivita(type) {
    if (type == 1) { //data
      this.studente["attivita"].sort((n1, n2) => n1.dataInizio - n2.dataInizio);
    } else if (type == 2) { //tipologia
      this.studente["attivita"].sort((n1, n2) => n1.tipo - n2.tipo);
    }
  }
}
