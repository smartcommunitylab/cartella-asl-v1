import { Component } from '@angular/core';

import { DataService } from '../../../../core/services/data.service'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgrammazioneService } from '../../../../core/services/programmazione.service';

@Component({
  selector: 'gestione-gruppo-aa',
  templateUrl: './gruppo-aa-gestione.html',
  styleUrls: ['./gruppo-aa-gestione.scss']

})
export class GruppoGestioneAttivitaAlt implements OnInit {

  attivitaAltGruppo;
  titolo: string;
  newConoscenza: string;
  newAbilita: string;
  isNewActivity: boolean = false;
  forceErrorDisplay: boolean = false;
  ricercaParam: any;
  studenti: any;
  studentiAggiunti = [];
  corsiStudio: any;
  anni = ["3", "4", "5"]
  classi = [];
  selectedAnno = "Tutti gli anni";
  selectedCorso = {
    courseId: undefined,
    titolo: "Tutti i corsi di studio"
  };
  selectedNome = "";
  selecteClasse = "";
  filter = {
    corsoId: "",
    annoScolastico: "",
    classe: "",
    nome: ""
  }
  pageSize: number = 2000;
  selectAll: boolean = false;
  tipologieAttivita;

  constructor(
    private router: Router,
    private programmaService: ProgrammazioneService,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  navTitle: string = "Gestione gruppo";
  breadcrumbItems = [
    {
      title: "List gruppo attivita'",
      location: "../../../",
      queryParams: { 'tab': 'classi' }
    },
    {
      title: "Modifica attivita'",
      location: "./"
    }
  ];


  ngOnChanges() {
  }

  ngOnInit() {
   
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.dataService.getAttivitaTipologie().subscribe((res) => {
          this.tipologieAttivita = res;
          this.dataService.getAttivitaAlternanzaById(id)
            .subscribe((activity: any) => {
              this.attivitaAltGruppo = activity;
              this.attivitaAltGruppo.studenti.forEach(saved => {
                this.studentiAggiunti.push(
                  {
                    studenteId: saved.id,
                    studente: saved.name + " " + saved.surname,
                    classe: saved.classe
                  }
                )
              });

              this.selectedCorso.courseId = this.attivitaAltGruppo.corsoId;
              this.selectedCorso.titolo = this.attivitaAltGruppo.corso;
              this.filter.corsoId = this.attivitaAltGruppo.corsoId;
              this.dataService.getClassiOfCorso(this.selectedCorso, this.attivitaAltGruppo.annoCorso).subscribe((response) => {
                this.classi = response;
                this.filter.classe = this.classi[0];
                this.selecteClasse = this.classi[0];
                this.cerca();
              }, (err: any) => console.log(err),
                () => console.log('get classi of corso.'));
            },
              (err: any) => console.log(err),
              () => console.log('get attivita by id.'));
        },
          (err: any) => console.log(err),
          () => console.log('get tipologia.'));

      }
    });
  
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
      this.studentiAggiunti = this.studentiAggiunti.filter(student => student.studenteId != studente.id);
      this.selectAll = false;
    }
    studente.partecipazione = e.target.checked;
  }
  addStudents() {
    let toBeSaved = [];
    this.studentiAggiunti.forEach(element => {
      if (element.studenteId) {
        toBeSaved.push(element.studenteId);
      }      
    });
    this.attivitaAltGruppo.studentiId = toBeSaved;
    this.dataService.updateAttivitaAlternanzaById(this.attivitaAltGruppo.id, this.attivitaAltGruppo)
      .subscribe((activity: any) => {
        this.router.navigate(['../../../'], { relativeTo: this.route, queryParams: { tab: 'classi' } });
      },
        (err: any) => console.log(err),
        () => console.log('error updating attivitaAlternanza'));

  }

  remove(addedStudent) {
    this.studentiAggiunti = this.studentiAggiunti.filter(student => student.studenteId != addedStudent.studenteId);
    this.selectAll = false;
    this.studenti.map(studente => {
      if (addedStudent.studenteId === studente.id) {
        studente.partecipazione = false;
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
      this.filter.classe = classe;
    }
  }

  cerca() {
    this.search(1);
  }

  search(page: number) {
    this.filter.nome = this.selectedNome;
    this.filter.annoScolastico = this.programmaService.getActualYear();
    this.dataService.getStudentiByFilter(this.filter, this.dataService.istitudeId, (page - 1), this.pageSize).subscribe((response) => {
      this.studenti = response.content;
      this.studenti.map(studente => {
        studente.partecipazione = this.studentiAggiunti.filter(studenteArray => studenteArray.studenteId === studente.id).length > 0;
      });
    },
      (err: any) => console.log(err),
      () => console.log('get classi'));
  }

  cancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route, queryParams: { tab: 'classi' } });
  }

  onSelectAllChange(e: any) {
    this.studentiAggiunti = [];
    this.selectAll = e.target.checked;
    for (let student of this.studenti) {
      student.partecipazione = e.target.checked;
      if (e.target.checked) {
        this.studentiAggiunti.push(
          {
            studenteId: student.id,
            studente: student.name + " " + student.surname,
            classe: student.classe
          }
        );
      }
    }    
  }

  getTipologia(id) {
    if (this.tipologieAttivita) {
      return this.tipologieAttivita.find(tipologia => tipologia.id == id).titolo;
    }
  }
  

}