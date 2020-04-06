import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { AttivitaPiano, PianoAlternanza } from '../../../../shared/classes/PianoAlternanza.class';

@Component({
  selector: 'cm-piano-attivita-edit',
  templateUrl: './piano-attivita-edit.component.html',
  styleUrls: ['./piano-attivita-edit.component.css']
})
export class PianoAttivitaEditComponent implements OnInit {

  attivita: AttivitaPiano = new AttivitaPiano();
  tipologie;
  yearIds;
  compileAllFields:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  navTitle:string = "Dettaglio attività";
  breadcrumbItems = [
    {
      title: "Piani alternanza",
      location: "../../../"
    },
    {
      title: "Dettaglio piano",
      location: "../"
    },
    {
      title: "Modifica attività",
      location: "./"
    }
  ];

  piano:PianoAlternanza;

  ngOnInit() {
    
    this.dataService.getAttivitaTipologie().subscribe(tipologie => {
      this.tipologie = tipologie;
    },
      (err: any) => console.log(err),
      () => console.log('get tipologie attivita'));

    this.route.params.subscribe(params => {
      let id = params['idAttivita'];
      let idPiano = params['id'];
      if (id == 'newactivity') {
        this.navTitle = "Crea attività";
        this.breadcrumbItems[this.breadcrumbItems.length-1].title = "Crea attività"; 

        this.route.queryParams.subscribe(params => {
          this.attivita.anno = +params['year']+3;
          this.yearIds = [];
          this.yearIds.push(params['yearId3']);
          this.yearIds.push(params['yearId4']);
          this.yearIds.push(params['yearId5']);
        });
      } else {

        this.dataService.getPianoById(idPiano).subscribe((piano: PianoAlternanza) => {
          this.piano = piano;

          this.findAttivitaInPianoById(id);

          this.yearIds = [];
          this.yearIds.push(this.piano.anniAlternanza[0].id);
          this.yearIds.push(this.piano.anniAlternanza[1].id);
          this.yearIds.push(this.piano.anniAlternanza[2].id);

          this.navTitle = this.attivita.titolo;
        },
        (err: any) => console.log(err),
        () => console.log('get piano by id'));

      }
    });
  }

  findAttivitaInPianoById(id) {
    this.attivita = this.piano.anniAlternanza[0].tipologieAttivita.find(data => data.id == id);
    if (this.attivita) {
      this.attivita.anno = 0+3;
      return;
    }
    this.attivita = this.piano.anniAlternanza[1].tipologieAttivita.find(data => data.id == id);    
    if (this.attivita) {
      this.attivita.anno = 1+3;
      return;
    } 
    this.attivita = this.piano.anniAlternanza[2].tipologieAttivita.find(data => data.id == id);    
    if (this.attivita) {
      this.attivita.anno = 2+3;
    }
  }

  cancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
  save() {
    if (!this.attivita.anno || !this.attivita.tipologia || !this.attivita.titolo) {
      this.compileAllFields = true;
      return;
    }

    let annoToGo = this.attivita.anno-3;
    this.attivita.anno = this.yearIds[this.attivita.anno-3];
    this.dataService.saveAttivitaPiano(this.attivita, this.attivita.anno).subscribe((attivita: AttivitaPiano) => {
      this.router.navigate(["../"], { relativeTo: this.route, queryParams: { year: annoToGo } });
    },
      (err: any) => console.log(err),
      () => console.log('save attivita piano'));
  }

}
