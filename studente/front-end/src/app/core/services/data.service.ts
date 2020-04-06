import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, } from 'rxjs/operators';
import { IPagedCompetenze } from '../../shared/classes/IPagedCompetenze.class';
import { GrowlerService, GrowlerMessageType } from '../growler/growler.service';
import { Studente } from '../../shared/interfaces';
import { serverAPIConfig } from '../serverAPIConfig'

@Injectable()
export class DataService {


  host: string = serverAPIConfig.host;

  private attivitaStudenteEndpoint = this.host + '/attivita/studente';
  private attivitaNoteEndpoint = this.host + '/attivita/noteStudente';
  private attivitaTipologieEndpoint = this.host + '/tipologieTipologiaAttivita';
  private getRegistrationClassi = this.host + '/registration/classi';
  private attivitaGiornalieraListaEndpoint = this.host + '/attivitaGiornaliera';
  private studenteEndpoint = this.host + '/studente';
  /** competenze. */
  competenzeAPIUrl: string = '/competenze'

  static growler;

  studenteId = '';
  listStudentiIds = [];

  timeout: number = 120000;

  constructor(
    private http: HttpClient,
    private growler: GrowlerService) {
    DataService.growler = growler;
  }


  setStudenteId(id) {
    if (id) {
      this.studenteId = id;
    }
  }

  setListId(list) {
    if (list) {
      this.listStudentiIds = list;
    }

  }

  getListId() {
    if (this.listStudentiIds)
      return this.listStudentiIds;
  }

  //ATTIVITA
  getAttivitaStudenteList(page, pageSize, studenteId, filters) {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', pageSize);
    params = params.append('studenteId', studenteId);

    if (filters) {
      if (filters.filterText)
        params = params.append('filterText', filters.filterText);
      if (filters.dataInizio)
        params = params.append('dataInizio', filters.dataInizio);
      if (filters.dataFine)
        params = params.append('dataFine', filters.dataFine);
      if (filters.stato)
        params = params.append('stato', filters.stato);
      if (filters.Tipologia)
        params = params.append('Tipologia', filters.Tipologia);
    }

    return this.http.get(
      this.attivitaStudenteEndpoint,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body);
        }),
        catchError(this.handleError)
      );
  }

  getAttivitaStudenteById(esperienzaId) {
    return this.http.get(this.attivitaStudenteEndpoint + "/details/" + esperienzaId)
      .timeout(this.timeout)
      .pipe(
        map(attivitaStudente => {
          return attivitaStudente;
        },
          catchError(this.handleError)
        )
      );
  }

  getIstitutoById(id: any): Observable<any> {
    let url = this.host + '/profile/istituto/' + id;

    return this.http.get<any>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        }),
        catchError(this.handleError)
      );
  }

  getListaStudentiByIds(ids: any): any {
    let singleObservables = ids.map((singleIds: string, urlIndex: number) => {
      return this.getStudedente(singleIds)
        .timeout(this.timeout)
        .map(single => single as Studente)
        .catch((error: any) => {
          console.error('Error loading Single, singleUrl: ' + singleIds, 'Error: ', error);
          return Observable.of(null);
        });
    });

    return Observable.forkJoin(singleObservables);
  }

  getStudedente(singleId: string): Observable<Studente> {
    return this.http.get<Studente>(
      `${this.studenteEndpoint}/${singleId}`,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let competenza = res.body as Studente;
          return competenza
        }));
  };

  //NOTE
  saveNoteStudente(esperienzaId, nota) {
    let params = new HttpParams();
    params = params.append('note', nota);
    return this.http.post(this.attivitaNoteEndpoint + "/" + esperienzaId, {},
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(attivitaStudente => {
          return attivitaStudente;
        },
          catchError(this.handleError)
        )
      );
  }

  //SCHEDA VALUTAZIONE
  getSchedaValutazione(esperienzaId) {
    return this.http.get(this.host + "/download/schedaValutazioneStudente/" + esperienzaId, { responseType: 'text' })
      .timeout(this.timeout)
      .pipe(
        map(scheda => {
          return scheda;
        },
          catchError(this.handleError)
        )
      );
  }

  saveSchedaValutazione(esperienzaId, schedaValutazione) {
    let formData: FormData = new FormData();
    formData.append('data', schedaValutazione, schedaValutazione.name);

    return this.http.post(this.host + "/upload/schedaValutazioneStudente/" + esperienzaId, formData, { responseType: 'text' })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  deleteSchedaValutazione(esperienzaId) {
    return this.http.delete(this.host + "/remove/schedaValutazioneStudente/" + esperienzaId)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  //DOCUMENTI
  getDocumentoById(documentoId) {
    return this.http.get(this.host + "/download/esperienzaSvolta/documento/" + documentoId, { responseType: 'text' })
      .timeout(this.timeout)
      .pipe(
        map(
          url => url,
          catchError(this.handleError)
        )
      );
  }

  createDocumento(esperienzaId, document: File, name: string) {
    let formData: FormData = new FormData();
    if (document) {
      formData.append('data', document, document.name);
    }

    let params = new HttpParams();
    params = params.append('nome', name);

    return this.http.post(this.host + "/attivita/esperienzaSvolta/" + esperienzaId + "/documento", formData,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  saveDocumentoById(documentoId, document: File, name: string) {
    let formData: FormData = new FormData();
    if (document) {
      formData.append('data', document, document.name);
    }

    let params = new HttpParams();
    params = params.append('nome', name);

    return this.http.put(this.host + "/attivita/esperienzaSvolta/documento/" + documentoId, formData,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  deleteDocumentoById(documentoId, espId) {
    return this.http.delete(this.host + "/attivita/esperienzaSvolta/" + espId + "/documento/" + documentoId)
      .timeout(this.timeout)
      .pipe(
        map(deleted => {
          return deleted;
        },
          catchError(this.handleError)
        )
      );
  }

  //GENERAL API
  getCompetenzeAPI(filterText: string, page: any, pageSize: any) {
    let url = this.host + this.competenzeAPIUrl;

    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', pageSize);

    if (filterText) {
      params = params.append('filterText', filterText);
    }

    return this.http.get<IPagedCompetenze>(
      url,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(map(res => {
        let competencies = res.body as IPagedCompetenze;
        return competencies;
      }), catchError(this.handleError));
    
  }

  getAttivitaTipologie(): Observable<object[]> {
    return this.http.get<object[]>(this.attivitaTipologieEndpoint)
      .timeout(this.timeout)
      .pipe(
        map(tipologie => {
          return tipologie;
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaGiornaliereReportStudenteById(id) {
    return this.http.get(this.attivitaGiornalieraListaEndpoint + '/esperienze/report/' + id)
      .timeout(this.timeout)
      .pipe(
        map(report => {
          return report
        },
          catchError(this.handleError)));
  }

  saveAttivitaGiornaliereStudentiPresenze(presenzeObject) {
    return this.http.put(this.attivitaGiornalieraListaEndpoint + '/calendario', presenzeObject)
      .timeout(this.timeout)
      .pipe(
        map(studenti => {
          return studenti
      },
        catchError(this.handleError))
      );
  }

  getAttivitaGiornalieraCalendario(idEsperienza) {
    return this.http.get<any>(this.attivitaGiornalieraListaEndpoint + "/calendario/" + idEsperienza)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
        catchError(this.handleError)
      )
    );
  }

  
  getStudenteAttivitaGiornalieraCalendario(idEsperienza, studenteId) {
    return this.http.get<any>(this.studenteEndpoint + "/" + studenteId + "/attivitaGiornaliera/calendario/" + idEsperienza)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
        catchError(this.handleError)
      )
    );
  }
  
  
  getProfile(): Observable<any> {
    let url = this.host + '/profile';
    return this.http.get<any>(url, {
      observe: 'response'
    })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        }),
      catchError(this.handleError)
    );
  }



  addConsent(): Observable<any> {
    let url = this.host + '/consent/add';

    return this.http.put(
      url,
      {
        observe: 'response',
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        }),
      catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    let errMsg = "Errore del server! Prova a ricaricare la pagina.";

    if (error.name === 'TimeoutError') {
      errMsg = error.message;
    }
    else if (error.error) {
      if (error.error.ex) {
        errMsg = error.error.ex;
        // Use the following instead if using lite-server
        //return Observable.throw(err.text() || 'backend server error');
      } else if (typeof error.error === "string") {
        try {
          let errore = JSON.parse(error.error);
          if (errore.ex) {
            errMsg = errore.ex;
          }
        }
        catch (e) {
          console.error('server error:', errMsg);
        }
      }
    }

    console.error('server error:', errMsg);
    
    let displayGrowl: boolean = true;
    // to avoid display growl tip inccase of 401 | 403
    if ((error.status == 401) || (error.status == 403)) {
      displayGrowl = false;
    }

    if (DataService.growler.growl && displayGrowl) {
      DataService.growler.growl(errMsg, GrowlerMessageType.Danger, 5000);
    }

    return Observable.throw(errMsg);

  }


}