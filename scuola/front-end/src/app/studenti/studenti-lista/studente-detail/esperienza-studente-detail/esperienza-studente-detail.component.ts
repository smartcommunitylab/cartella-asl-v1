import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenzaDetailModalComponent } from '../../../../skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component';
import { OpportunitiesModal } from '../opportunities-modal/opportunities-modal.component';
import { Attivita } from '../../../../shared/classes/Attivita.class';
import * as moment from 'moment';
import { DiaryModal } from '../diary-modal/diary-modal.component';
import { serverAPIConfig } from '../../../../core/serverAPIConfig'

@Component({
  selector: 'cm-esperienza-studente-detail',
  templateUrl: './esperienza-studente-detail.component.html',
  styleUrls: ['./esperienza-studente-detail.component.css']
})
export class EsperienzaStudenteDetailComponent implements OnInit {

  navTitle: string = "Dettaglio esperienza";
  breadcrumbItems = [
    {
      title: "Lista studenti",
      location: "../../",
    },
    {
      title: "Dettaglio studente",
      location: "../"
    },
    {
      title: "Dettaglio esperienza",
      location: "./"
    }
  ];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) { }

  studente:any = {};
  esperienza;
  tipologie;
  idStudente;
  idEsperienza;
  stato;
  studenti;

  showNoteGiornaliere:true;
  
  ngOnInit() {
    this.studente = JSON.parse(sessionStorage.getItem("studenteReport"));

    this.route.params.subscribe(params => {
      this.idStudente = params['idStudente'];
      this.idEsperienza = params['idEsperienza'];
      
      if (this.studente.studenteId != this.idStudente) { //check for url manipulations
        this.router.navigate(['../'], { relativeTo: this.route });
        return;
      }

      this.dataService.getEsperienzaById(this.idEsperienza).subscribe((esperienza) => {
        this.esperienza = esperienza;

        this.dataService.getAttivitaTipologie().subscribe((res) => {
          this.tipologie = res;
          this.showNoteGiornaliere = this.getTipologia(this.esperienza.attivitaAlternanza.tipologia).diarioDiBordo;
        });

        this.dataService.getAttivitaGiornaliereStudenteById(this.idStudente).subscribe((attivita) => {
          // this.studente["attivita"] = attivita;

          let esperienza = (<any[]>attivita).find(attivitaArray => attivitaArray.esperienzaId == this.idEsperienza);
          this.stato = esperienza.stato;
          this.dataService.getAttivitaGiornalieraCalendario(this.esperienza.attivitaAlternanza["id"]).subscribe((studenti: any) => {
            this.studenti = studenti;
            this.initDays();
          },(err: any) => console.log(err),
          () => console.log('get attivita giornaliera studente by id'));
        },
          (err: any) => console.log(err),
          () => console.log('get attivita giornaliera studente by id'));
      },
        (err: any) => console.log(err),
        () => console.log('get attivita giornaliera studente by id'));

    });
  }

  initDays() {
    // put objecty
    
    var startDate = moment(this.esperienza.attivitaAlternanza.dataInizio);
    var endDate = moment(this.esperienza.attivitaAlternanza.dataFine);
    var tot = endDate.diff(startDate, 'days');   // =1
    
    var now = startDate.clone();
    if (this.studenti[this.esperienza["studente"].id].giornate.length < (tot+1))
    while (now.diff(endDate,'days')<=0) {
      this.esperienza.presenze.giornate.push({
        "data": now.format('YYYY-MM-DD'),
        "presente": false,
        "oreSvolte": 0,
        "attivitaSvolta": ""
      });
      now.add(1, 'days');
    }
  }
  getTipologiaTitle(id) {
    if (!this.tipologie) return id;
    return this.tipologie.find(tipologia => tipologia.id == id).titolo;
  }

  getTipologia(id) {
    if (!this.tipologie) return id;
    return this.tipologie.find(tipologia => tipologia.id == id);
  }

  openDetailCompetenza(competenza) {
    const modalRef = this.modalService.open(CompetenzaDetailModalComponent, { size: "lg" });
    modalRef.componentInstance.competenza = competenza;
  }
  openOpportunity() {
    //open modal with opportunity
    const modalRef = this.modalService.open(OpportunitiesModal, { size: "lg" });
    modalRef.componentInstance.attivita = this.esperienza;
  }
  openDiary(giornata) {
    const modalRef = this.modalService.open(DiaryModal, { size: "lg" });
    //get diary
    modalRef.componentInstance.attivitaSvolta = giornata.attivitaSvolta;
  }
  isBefore(giornata){
    return moment(giornata.data).isBefore(moment());
    
  }
  isAfter(giornata){
    return moment(giornata.data).isAfter(moment());
    
  }
  downloadSchedaAzienda() {
    this.dataService.downloadschedaValutazioneAzienda(this.idEsperienza).subscribe((res) => {
      //download from res.url
      window.open(serverAPIConfig.host + '/' + res.url, '_blank');
    }, (err: any) => {

    })
  }
  downloadSchedaStudente() {
    this.dataService.downloadschedaValutazioneStudente(this.idEsperienza).subscribe((res) => {
      //download from res.url
      window.open(serverAPIConfig.host + '/' + res.url, '_blank');
    }, (err: any) => {

    })

  }
  savePresenze() {
    this.dataService.saveAttivitaGiornaliereStudentePresenze(this.idStudente, this.esperienza.id, this.esperienza.giornate).subscribe((studente) => {
    },
      (err: any) => console.log(err),
      () => console.log('save attivita giornaliera studente presenze'));
  }

}
