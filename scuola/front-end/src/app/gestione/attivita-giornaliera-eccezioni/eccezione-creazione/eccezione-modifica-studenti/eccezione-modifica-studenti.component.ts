import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { Competenza } from '../../../../shared/classes/Competenza.class';
import { ProgrammazioneService } from '../../../../core/services/programmazione.service';

@Component({
  selector: 'cm-eccezione-modifica-studenti',
  templateUrl: './eccezione-modifica-studenti.component.html',
  styleUrls: ['./eccezione-modifica-studenti.component.css']
})
export class EccezioneModificaStudentiComponent implements OnInit {
  ricercaParam: any;
  attivitaAlt;

  // piano: PianoAlternanza;
  addCompetenzeBtnText: string = "Aggiungi studenti";
  navTitle: string = "Modifica studenti eccezione";
  breadcrumbItems = [
    {
      title: "Lista eccezioni",
      location: "../../../",
    },
    {
      title: "Dettaglio eccezione",
      location: "../../../"
    },
    {
      title: "Ricerca",
      location: "../../../search"
    },
    {
      title: "Risoluzione eccezione",
      location: "../"
    },
    {
      title: "Modifica studenti",
      location: "./"
    }

  ];


  studenti: any; //competenze already added to the piano
  studentiAggiunti: any;
  corsiStudio: any;
  anni = ["3", "4", "5"]
  classi = [];
  selectedAnno = "Tutti gli anni";
  selectedCorso = {
    courseId: undefined,
    titolo: "Tutti i corsi di studio"
  };
  selectedNome = "";
  selecteClasse = "Tutte";
  filter = {
    corsoId: "",
    annoScolastico: "",
    classe: "",
    nome: ""
  }
  totalRecords: number = 0;
  pageSize: number = 10;

  constructor(private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private programmaService: ProgrammazioneService,
    private activeRoute: ActivatedRoute) { }


  ngOnChanges() {
  }
  ngOnInit() {
    this.studentiAggiunti = JSON.parse(sessionStorage.getItem('studenti'));
    let attivAltid = JSON.parse(sessionStorage.getItem('eccezioneId'));

    this.dataService.getAttivitaAlternanzaByIdAPI(attivAltid)
      .subscribe((activity) => {
        this.attivitaAlt = activity;
        this.selectedCorso.courseId = this.attivitaAlt.corsoId;
        this.selectedCorso.titolo = this.attivitaAlt.corso;
        this.filter.corsoId = this.attivitaAlt.corsoId;
        this.dataService.getClassiOfCorso(this.selectedCorso, this.attivitaAlt.annoCorso).subscribe((response) => {
          this.classi = response;
          this.filter.classe = this.classi[0];
          this.selecteClasse = this.classi[0];
          this.search(1);
        });
      }

      );


  }



  onFilterChange(e: any, studente) {
    if (e.target.checked) {
      //addStudente
      this.studentiAggiunti.push(
        {
          studenteId: studente.id,
          studente: studente.name + " " + studente.surname,
          classe: studente.classe
        }
      );
    } else {
      //remove studente
      this.studentiAggiunti = this.studentiAggiunti.filter(studente => studente.studenteId != studente.id);
    }
  }
  addStudents() {
    sessionStorage.setItem('studenti', JSON.stringify(this.studentiAggiunti));
    this.router.navigate(['../'], { relativeTo: this.activeRoute });
  }
  selectCorsoFilter(corso) {
    this.selectedCorso = corso;
    this.filter.corsoId = corso.corsoId;

    this.dataService.getClassiOfCorso(this.selectedCorso, null).subscribe((response) => {
      this.classi = response;
      if (this.classi) {
        this.selecteClasse = this.classi[0];
      }
    });
  }
  selectAnnoFilter(anno) {
    this.selectedAnno = anno;
    this.filter.annoScolastico = anno;

  }
  selectClasseFilter(classe) {
    if (classe) {
      this.selecteClasse = classe;
    } else {
      this.selecteClasse = "Tutte";
    }
    this.filter.classe = classe;
  }
  search(page: number) {
    this.filter.nome = this.selectedNome;
    this.filter.annoScolastico = this.programmaService.getActualYear();
    this.dataService.getStudentiByFilter(this.filter, this.dataService.istitudeId, (page - 1), this.pageSize).subscribe((response) => {
      this.studenti = response.content;
      this.totalRecords = response.totalElements;
      this.studenti.map(studente => {
        studente.partecipazione = this.studentiAggiunti.filter(studenteArray => studenteArray.studenteId === studente.id).length > 0;
      });
    },
      (err: any) => console.log(err),
      () => console.log('get classi'));
  }

  pageClassiChanged(page: number) {
    this.search(page);
  }
}
