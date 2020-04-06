import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-eccezione-detail',
  templateUrl: './eccezione-detail.component.html',
  styleUrls: ['./eccezione-detail.component.css']
})
export class EccezioneDetailComponent implements OnInit {

  @Input() eccezione;
  @Input() tipologieAttivita;
  @Output() backFunction = new EventEmitter();

  navTitle: string = "Dettaglio eccezione";
  breadcrumbItems = [
    {
      title: "Lista eccezioni",
      location: "./",
      customAction: true
    },
    {
      title: "Dettaglio eccezione",
      location: "./"
    }
  ];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) { }

  singleActivity;
  ricercaParam;
  ngOnInit() {

  }

  manageCustomActionBreadcrumb($event) {
    this.backFunction.emit();
  }
  getTipologia(id) {
    if (this.tipologieAttivita) {
      return this.tipologieAttivita.find(tipologia => tipologia.id == id).titolo;
    }
  }
  cancel() {
    this.backFunction.emit();
  }
  search() {
    this.ricercaParam = {
      attivita: this.eccezione.tipologia,
      istitutoId:this.dataService.istitudeId,
      competenze: [],
      fromDate: null,
      toDate: null,
      coordinates: [],
      distance: 0

    }
    sessionStorage.setItem('studenti', JSON.stringify(this.eccezione.dettagli));
    sessionStorage.setItem('pianoAlternanzaId', JSON.stringify(this.eccezione.pianoAlternanzaId));
    sessionStorage.setItem('eccezioneId', JSON.stringify(this.eccezione.attivitaAlternanzaId));
    sessionStorage.setItem('searchActivitiesOptions', JSON.stringify(this.ricercaParam));
    this.router.navigate(['search'], { relativeTo: this.route });
  }
  getPercentage() {
    if (this.singleActivity && this.singleActivity.presenze && this.singleActivity.attivitaAlternanza && this.singleActivity.attivitaAlternanza.ore != 0)
      return (this.singleActivity.presenze.oreSvolte / this.singleActivity.attivitaAlternanza.ore) * 100
    return 0
  }
  panelChange($event) {
    if ($event.nextState) {
      this.singleActivity = undefined;
      this.dataService.getEsperienzaById(this.eccezione.dettagli[$event.panelId].esperienzaSvoltaId).subscribe((res: any) => {
        this.singleActivity = res;
      },
        (err: any) => console.log(err),
        () => console.log('get attivita by id'));
    }

    this.eccezione.dettagli.forEach(element => {
      element.selected = false;
    });
    this.eccezione.dettagli[$event.panelId].selected = $event.nextState;
  }

}
