import { Component, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../core/services/data.service'
import { Attivita } from '../../../../shared/classes/Attivita.class';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'opportunities-modal',
  templateUrl: './opportunities-modal.component.html',
  styleUrls: ['./opportunities-modal.component.css']
})
export class OpportunitiesModal implements OnInit {

  closeResult: string;
  esperienza;
  tipologie;
  attivitaCompatibili;

  @Input() attivita: Attivita;

  constructor(public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private dataService: DataService) {

  }
  ngOnInit(): void {
    //search and show opportunities
    this.route.params.subscribe(params => {
      this.dataService.getEsperienzaById(this.attivita["id"]).subscribe((esperienza) => {
        if (esperienza) {
          this.esperienza = esperienza;
          //TO DO paged search even in modal?
          this.dataService.getOpportunitaByFilter(0,10,{ tipologia: this.esperienza.attivitaAlternanza.tipologia }).subscribe((res) => {
            this.attivitaCompatibili = res.content;
          });
        }
      },
        (err: any) => console.log(err),
        () => console.log('get attivita giornaliera studente by id'));
    })
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologie = res;
    });

  }
  getTipologiaTitle(id) {
    if (!this.tipologie) return id;
    return this.tipologie.find(tipologia => tipologia.id == id).titolo;
  }

}
