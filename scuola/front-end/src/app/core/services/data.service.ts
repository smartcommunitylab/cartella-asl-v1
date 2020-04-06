import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, } from 'rxjs/operators';
import { Attivita } from '../../shared/classes/Attivita.class';
import { Richiesta } from '../../shared/classes/Richiesta.class';
import { ReportClasse } from '../../shared/classes/ReportClasse.class';
import { ReportStudente } from '../../shared/classes/ReportStudente.class';
import { Competenza } from '../../shared/classes/Competenza.class';
import { PianoAlternanza, AttivitaPiano } from '../../shared/classes/PianoAlternanza.class';
import { IPagedCorsoInterno } from '../../shared/classes/IPagedCorsoInterno.class';
import { IApiResponse } from '../../shared/classes/IApiResponse.class';
import { IPagedCompetenze } from '../../shared/classes/IPagedCompetenze.class';
import { GrowlerService, GrowlerMessageType } from '../growler/growler.service';
import { CorsoDiStudio } from '../../shared/classes/CorsoDiStudio.class';
import { config } from '../../config';
import { serverAPIConfig } from '../serverAPIConfig'
import { IState, IOrder, Azienda, IPagedES, IPagedAA, EsperienzaSvolta, AttivitaAlternanza, Valutazione, Giornate, IPagedOffers, IOffer, IPagedResults } from '../../shared/interfaces';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {
  
  istitudeId: string = "19a46a53-8e10-4cd0-a7d0-fb2da217d1be";
  //istitudeId: string = '6246e755-cd2b-423a-82fc-6c13ef238052';
  listIstituteIds = [];
  // istitudeId: string = 'fdef62ac-63bf-4da8-9385-f33d7ee645ec';
  istituto: string = "Centro Formazione Professionale Agrario - S. Michele all'Adige'";

  host: string = serverAPIConfig.host;

  private attivitaTipologieEndpoint = this.host + '/tipologieTipologiaAttivita';
  private getRegistrationClassi = this.host + '/registration/classi';
  private attivitaArchivio = 'api/attivitaArchivio';  // URL to web api
  private attivitaAttive = 'api/attivitaAttive';  // URL to web api
  private attivitaFiltro = 'api/attivitaFiltro';  // URL to web api
  private attivitaDelete = 'api/attivita/delete';  // URL to web api
  private attivitaModifica = 'api/attivita/modifica';  // URL to web api
  
  private richieste = 'api/richieste';
  private refuseRichiestaEndpoint = 'api/refuserichiesta';

  private competenzeEndpoint = this.host + '/competenze';
  private competenzeAttivitaEndpoint = 'api/competenze/attivita'

  private pianiListaEndpoint = this.host + '/pianiAlternanza';
  private pianoAlteranzaEndpoint = this.host + '/pianoAlternanza'
  private annoAlternanzaEndpoint = this.host + '/annoAlternanza/'
  // private pianoAnnoAlternanzaEndpoint = this.host + '/annoAlternanza'
  private corsiStudio = this.host + '/corsiDiStudio/';

   private reportClassiByPiano = this.host + "/programmazione";
  private attivitaAlternanza = this.host + "/programmazione"
  private reportStudentiByPiano = this.host + "/programmazione";
  private reportClasse = this.host + "/report";
  private competenzeEndpointsingleId = this.host + "/competenza";
  private attivitaEndpointsingleId = this.host + "/tipologiaTipologiaAttivita";
  private attivitaGiornalieraEccezioniEndpoint = this.host + '/eccezioni/list';
  private attivitaGiornalieraListaEndpoint = this.host + '/attivitaGiornaliera';

  private attivitaGiornalieraStudentiEndpoint = this.host + '/attivitaGiornaliera/studenti/report';
  private attivitaGiornalieraStudentiStatusEndpoint = this.host + '/attivitaGiornaliera/esperienze/report'
  private attivitaAlternanzaEndpoint = this.host + '/attivitaAlternanza';
  private addOpportunita = this.host + '/attivitaAlternanza';
  private deleteAttivitaEndpoint = this.host + '/attivitaAlternanza';
  private searchOpportunita = this.host + '/oppCorsi/ricerca';
  private opportunitaDetail = this.host + '/oppCorso';
  private studentiProfiles = this.host + '/studenti/profiles';
  private classiRegistration = this.host + '/registration/classi';
  private solveEccezioni = this.host + '/eccezioni/attivita';
  private esperienzaEndPoint = this.host + '/esperienzaSvolta/details';
  /** corsointerne. **/
  corsointerneAPIUrl: string = '/corsointerno';
  corsoDiStudioAPIUrl: string = '/corsi';

  /** competenze. */
  competenzeAPIUrl: string = '/competenze';
  istitutoCompetenzeAPIUrl: string = '/competenza/istituto';
  istitutoCompetenzeDetailAPIUrl: string = '/competenza/';

  static growler;

  timeout: number = 150000;

  coorindateIstituto;

  constructor(
    private http: HttpClient,
    private growler: GrowlerService) {
    DataService.growler = growler;
  }

  setIstituteId(id) {
    if (id) {
      this.istitudeId = id;
    }
  }

  setIstitutoName(name) {
    if (name) {
      this.istituto = name;
    }
  }

  getIstitutoName(): string {
    return this.istituto;
  }

  setListId(list) {
    if (list) {
      this.listIstituteIds = list;
    }

  }

  setIstitutoPosition(coord) {
    this.coorindateIstituto = coord;
  }

  getIstitutoPosition() {
    return this.coorindateIstituto;
  }

  getListId() {
    if (this.listIstituteIds)
      return this.listIstituteIds;
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

  getAttivitaArchivio(): Observable<Attivita[]> {
    return this.http.get<Attivita[]>(this.attivitaArchivio)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }

  updatePianoAnnoOre(annoAlternanza) {
    return this.http.put<any>(this.annoAlternanzaEndpoint, {
      id: annoAlternanza.id,
      oreTotali: Number(annoAlternanza.oreTotali)

    })
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaArchivioPage(page: number, pageSize: number): Observable<any> {
    return this.http.get<Attivita[]>(
      `${this.attivitaArchivio}/page/${page}/${pageSize}`,
      { observe: 'response' })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalAttivita = +res.headers.get('X-InlineCount');
          let attivita = res.body as Attivita[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: attivita,
            totalRecords: totalAttivita
          };
        }),
        catchError(this.handleError)
      );
  }

  getAttivitaAlternanzaById(attivitaId) {
    return this.http.get(this.attivitaAlternanzaEndpoint + "/" + attivitaId)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }

  getPagedCorsoInterno(istitutoId: any, dataInizio: any, dataFine: any, tipologia: any, filterText: any, page: any, pageSize: any): Observable<IPagedCorsoInterno> {

    let url = this.host + this.corsointerneAPIUrl + '/' + istitutoId;

    let headers = new HttpHeaders();

    let params = new HttpParams();

    if (dataInizio)
      params = params.append('dataInizio', dataInizio);
    if (dataFine)
      params = params.append('dataFine', dataFine);
    if (tipologia)
      params = params.append('tipologia', tipologia);
    if (filterText)
      params = params.append('filterText', filterText);


    params = params.append('page', page);
    params = params.append('size', pageSize);

    return this.http.get<IPagedCorsoInterno>(
      url,
      {
        headers: headers,
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body as IPagedCorsoInterno);

        }),
        catchError(this.handleError)
      );
  }

  getAttivitAlternanzaById(attivitaId): Observable<Attivita> {
    let url = this.attivitaAlternanzaEndpoint + attivitaId;

    return this.http.get<Attivita>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body as Attivita;
          return attivita;
        }),
        catchError(this.handleError)
      );
  }

  getEsperienzaById(esperienzaId): Observable<any> {
    let url = this.esperienzaEndPoint + '/' + esperienzaId;

    return this.http.get<any>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body;
          return attivita;
        }),
        catchError(this.handleError)
      );
  }

  getAttivitaById(attivitaId): Observable<Attivita> {
    let url = this.host + this.corsointerneAPIUrl + '/details/' + attivitaId;

    return this.http.get<Attivita>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body as Attivita;
          return attivita;
        }),
        catchError(this.handleError)
      );
  }

  // POST/corsointerno/details/
  addCorsoInterno(attivita: Attivita): Observable<Attivita> {
    let url = this.host + this.corsointerneAPIUrl + '/details/';
    return this.http.post<Attivita>(
      url,
      attivita,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok) {
            return (res.body as Attivita);
          } else
            return res;
        }
        ),
        catchError(this.handleError))
  }

  // PUT/corsointerno/details/{id}
  updateCorsoInterno(attivita: Attivita) {
    let url = this.host + this.corsointerneAPIUrl + '/details/' + attivita.id;

    return this.http.put<IApiResponse>(
      url,
      attivita,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError))
  }

  // PUT /corsointerno/{id}/competenze
  updateCompetenze(id: any, listComptenze: any) {
    let url = this.host + this.corsointerneAPIUrl + '/' + id + "/competenze";
    return this.http.put<IApiResponse>(
      url,
      listComptenze,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError))

  }

  // DELETE /corsointerno/{id}
  deleteCorsoInterno(id: number): Observable<boolean> {
    let url = this.host + this.corsointerneAPIUrl + "/" + id;
    return this.http.delete<IApiResponse>(
      url,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError)
      );
  }

  /** Competenze. **/
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

  getPagedIstitutoCompetenze(istitutoId: any, filterText: string, page: any, pageSize: any) {

    let url = this.host + this.competenzeAPIUrl;

    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', pageSize);
    params = params.append('istitutoId', istitutoId);

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

  getIstiutoCompetenzaDetail(competenzaId: any): Observable<Competenza> {
    let url = this.host + this.istitutoCompetenzeDetailAPIUrl + "/" + competenzaId;

    return this.http.get<Competenza>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let competenza = res.body as Competenza;
          return competenza;
        }),
        catchError(this.handleError)
      );
  }

  deleteCompetenzaIstituto(competenzaId: any): Observable<boolean> {
    let url = this.host + this.istitutoCompetenzeAPIUrl + '/' + competenzaId;
    return this.http.delete<IApiResponse>(
      url,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError)
      );
  }

  addIstitutoCompetenza(istitutoId: any, competenza: Competenza): Observable<Competenza> {
    let url = this.host + this.istitutoCompetenzeAPIUrl + "/" + istitutoId;
    return this.http.post<Competenza>(
      url,
      competenza,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok) {
            return (res.body as Competenza);
          } else
            return res;
        }
        ),
        catchError(this.handleError))
  }

  updateIstitutoCompetenza(istitutoId: any, competenza: Competenza): Observable<Competenza> {
    let url = this.host + this.istitutoCompetenzeAPIUrl + "/" + istitutoId;
    return this.http.put<Competenza>(
      url,
      competenza,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok) {
            return (res.body as Competenza);
          } else
            return res;
        }
        ),
        catchError(this.handleError))
  }

  /** DATA. **/
  getData(type: any): Observable<any> {

    let url = this.host + "/data";

    let params = new HttpParams();
    params = params.append('type', type);

    return this.http.get<any>(url,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {

          return this.generateArray(res.body);
        }),
        catchError(this.handleError)
      );
  }


  generateArray(obj) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }

  getCorsoDiStudioByInstituteSchoolYear(istitutoId: string, schoolYear: string): Observable<any> {
    let url = this.host + this.corsoDiStudioAPIUrl + '?istitutoId=' + istitutoId + '&schoolYear=' + schoolYear;

    return this.http.get<CorsoDiStudio[]>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body as CorsoDiStudio[]);
        }),
        catchError(this.handleError)
      );
  }

  getRichiestePage(page: number, pageSize: number): Observable<any> {
    return this.http.get<Richiesta[]>(
      `${this.richieste}/page/${page}/${pageSize}`,
      { observe: 'response' })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalRichieste = +res.headers.get('X-InlineCount');
          let richieste = res.body as Richiesta[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: richieste,
            totalRecords: totalRichieste
          };
        }),
        catchError(this.handleError)
      );
  }

  getAttivitaAttive(): Observable<Attivita[]> {
    return this.http.get<Attivita[]>(this.attivitaAttive)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }

  deleteAttivita(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.attivitaDelete + '/' + id)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  modificaAttivita(attivita: Attivita): Observable<Attivita> {
    return this.http.post<Attivita>(this.attivitaModifica, attivita)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  filterAttivitaAttive(filtro): Observable<Attivita[]> {
    return this.http.get<Attivita[]>(this.attivitaFiltro)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }

  getRichieste(): Observable<Richiesta[]> {
    return this.http.get<Richiesta[]>(this.richieste)
      .timeout(this.timeout)
      .pipe(
        map(richiesta => {
          return richiesta
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  getRichiestaById(richiestaId): Observable<Richiesta> {
    return this.http.get<Richiesta>(this.richieste + '/' + richiestaId)
      .timeout(this.timeout)
      .pipe(
        map(richiesta => {
          return richiesta
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  refuseRichiesta(richiesta: Richiesta): Observable<Richiesta> {
    return this.http.post<Richiesta>(this.refuseRichiestaEndpoint, richiesta)
      .timeout(this.timeout)
      .pipe(catchError(this.handleError))
  }

  /** Competenze */
  getCompetenze(profiloId): Observable<Competenza[]> {
    return this.http.get<Competenza[]>(this.competenzeEndpoint + "/" + profiloId)
      .timeout(this.timeout)
      .pipe(
        map(competenze => {
          return competenze
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  getCompetenzeFiltered(filterTxt): Observable<Competenza[]> {
    return this.http.get<Competenza[]>(
      this.competenzeEndpoint,
      {
        params: {
          filterText: filterTxt
        }
      })
      .timeout(this.timeout)
      .pipe(
        map(competenze => {
          return competenze
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  getCompetenzeByAttivita(attivitaId): Observable<Competenza[]> {
    return this.http.get<Competenza[]>(this.competenzeAttivitaEndpoint + "/" + attivitaId)
      .timeout(this.timeout)
      .pipe(
        map(competenze => {
          return competenze
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  assignCompetenzeToAttivita(attivitaId, competenze) {
    return this.http.post<Competenza[]>(this.competenzeAttivitaEndpoint + "/" + attivitaId, competenze)
      .timeout(this.timeout)
      .pipe(
        map(competenze => {
          return competenze
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  deleteCompetenzaFromAttivita(attivitaId, competenzaId) {
    return this.http.delete(this.competenzeAttivitaEndpoint + "/" + attivitaId, competenzaId)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  getPianiPage(page: number, archivio?: boolean, corsoStudioFilter?: string): Observable<any> {
    return this.http.get<PianoAlternanza[]>(
      this.pianiListaEndpoint + '/completo',
      {
        params: {
          istitutoId: this.istitudeId,
          corsoDiStudioId: corsoStudioFilter,
          page: page + '',
          size: "10",
          stato: archivio ? "2" : "",
          annoScolasticoCorrente: config.schoolYear
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalPiani = +res.headers.get('X-InlineCount');
          let piani = res.body as PianoAlternanza[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: piani,
            totalRecords: totalPiani
          };
        }),
        catchError(this.handleError)
      );
  }

  getCorsiStudio() {
    return this.http.get(this.corsiStudio + this.istitudeId,
      {
        params: {
          annoScolastico: config.schoolYear
        }
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

  getCorsiStudioJson() {
    return this.http.get(this.corsiStudio + this.istitudeId)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  getPianoById(pianoId): Observable<PianoAlternanza> {
    return this.http.get<PianoAlternanza>(this.pianoAlteranzaEndpoint + '/' + pianoId)
      .timeout(this.timeout)
      .pipe(
        map(piano => {
          return piano;
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  getPianoByIdJson(pianoId): Observable<PianoAlternanza> {
    return this.http.get<PianoAlternanza>(this.pianoAlteranzaEndpoint + '/' + pianoId)
      .timeout(this.timeout)
      .pipe(
        map(piano => {
          return piano;
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  getAttivitaPianoById(attivitaId): Observable<AttivitaPiano> {
    return this.http.get<AttivitaPiano>(this.host + "/tipologiaAttivita/" + attivitaId)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita;
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  saveAttivitaPiano(attivitaPiano: AttivitaPiano, yearId): Observable<AttivitaPiano> {
    return this.http.put<AttivitaPiano>(this.annoAlternanzaEndpoint + yearId + '/tipologiaAttivita', attivitaPiano)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita;
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  createPiano(piano): Observable<PianoAlternanza> {
    piano.istitutoId = this.istitudeId;
    piano.istituto = this.istituto;
    if (!piano.annoScolasticoAttivazione) {
      piano.annoScolasticoAttivazione = config.schoolYear;
    }
    return this.http.post<PianoAlternanza>(this.pianoAlteranzaEndpoint, piano)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  updatePianoDetails(piano): Observable<PianoAlternanza> {
    return this.http.put<PianoAlternanza>(this.pianoAlteranzaEndpoint, piano)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  clonePiano(piano) {
    return this.http.post<PianoAlternanza>(this.pianoAlteranzaEndpoint + "/clone/" + piano.id, {})
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  modificaPiano(piano: PianoAlternanza): Observable<PianoAlternanza> {
    return this.http.post<PianoAlternanza>(this.pianoAlteranzaEndpoint + '/' + piano.id, piano)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  deletePiano(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.pianoAlteranzaEndpoint + '/' + id)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  attivaPiano(piano: PianoAlternanza, stato): Observable<PianoAlternanza> {
    var url = this.pianoAlteranzaEndpoint + '/' + (stato ? 'activate' : 'deactivate') + '/' + piano.id;
    return this.http.put<PianoAlternanza>(url, {})
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  deleteAttivitaFromPiano(annoAlternanzaId, attivitaId) {
    return this.http.delete(this.annoAlternanzaEndpoint + annoAlternanzaId + "/tipologiaAttivita/" + attivitaId, {})
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  deleteCompetenzaFromPiano(pianoId, competenzaId) {
    return this.http.delete(this.pianoAlteranzaEndpoint + "/" + pianoId + "/competenze/" + competenzaId)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  assignCompetenzeToPiano(pianoId, competenze) {
    let idCompetenze = [];
    competenze.forEach(element => {
      idCompetenze.push(element.id);
    });
    console.log(idCompetenze);
    return this.http.put<Competenza[]>(this.pianoAlteranzaEndpoint + "/" + pianoId + "/competenze", idCompetenze)
      .timeout(this.timeout)
      .pipe(
        map(competenze => {
          return competenze
        },
          catchError(
            this.handleError
          )
        )
      );
  }

  getPianiPerProgrammiArchivioPage(page: number, pageSize: number, annoScolastico: string, corsoStudioFilter?: string): Observable<any> {
    return this.http.get<PianoAlternanza[]>(
      this.pianiListaEndpoint + '/stato',
      {
        params: {
          istitutoId: this.istitudeId,
          corsoDiStudio: corsoStudioFilter,
          page: page + '',
          size: pageSize + '',
          annoScolasticoCorrente: annoScolastico,
          stato: "2"
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let piani = res.body;
          return {
            results: piani
          };
        }),
        catchError(this.handleError)
      );
  }


  getPianiPerProgrammiAttiviPage(page: number, pageSize: number, annoScolastico: string, corsoStudioFilter?: string, stato?: string): Observable<any> {
    return this.http.get<PianoAlternanza[]>(
      this.pianiListaEndpoint + '/stato',
      {
        params: {
          istitutoId: this.istitudeId,
          corsoDiStudioId: corsoStudioFilter,
          page: page + '',
          size: pageSize + '',
          annoScolasticoCorrente: annoScolastico,
          stato: stato
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let piani = res.body;
          return {
            results: piani
          };
        }),
        catchError(this.handleError)
      );
  }
  getClassiReportByPianoPage(pianoId: string, page: number, pageSize: number, annoScolastico?: string, annoCorso?: string): Observable<any> {
    let params = new HttpParams();

    if (annoCorso)
      params = params.append('annoCorso', annoCorso);
    if (page >= 0)
      params = params.append('page', page + "");
    if (pageSize)
      params = params.append('size', pageSize + '');
    if (annoScolastico)
      params = params.append('annoScolastico', annoScolastico);

    return this.http.get<ReportClasse[]>(
      `${this.reportClassiByPiano}/${pianoId}/classi/report`,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalClassi = +res.headers.get('X-InlineCount');
          let classi = res.body as ReportClasse[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: classi,
            totalRecords: totalClassi
          };
        }),
        catchError(this.handleError)
      );
  }

  getClassiReportByClassePage(pianoId: string, classe: string, annoScolastico: string, annoCorso: string): Observable<any> {
    return this.http.get<ReportClasse[]>(
      `${this.reportClassiByPiano}/${pianoId}/classi/report`,
      {
        params: {
          annoCorso: annoCorso,
          annoScolastico: annoScolastico,
          classe: classe
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalClassi = +res.headers.get('X-InlineCount');
          let classi = res.body as ReportClasse[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: classi,
            totalRecords: totalClassi
          };
        }),
        catchError(this.handleError)
      );
  }

  getClassiByCorso(corso) {
    return this.http.get<ReportStudente[]>(
      `${this.getRegistrationClassi}/${corso}/${this.istitudeId}/${config.schoolYear}`,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalStudenti = +res.headers.get('X-InlineCount');
          let studenti = res.body as ReportStudente[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: studenti,
            totalRecords: totalStudenti
          };
        }),
        catchError(this.handleError)
      );

  }

  getStudentiReportByPianoPage(pianoId: string, page: number, pageSize: number, annoScolastico?: string, annoCorso?: string, nome?: string): Observable<any> {
    let params = new HttpParams();

    if (annoCorso)
      params = params.append('annoCorso', annoCorso);
    if (page >= 0)
      params = params.append('page', page + "");
    if (pageSize)
      params = params.append('size', pageSize + '');
    if (annoScolastico)
      params = params.append('annoScolastico', annoScolastico);
    if (nome)
      params = params.append('nome', nome);
    return this.http.get<ReportStudente[]>(
      `${this.reportStudentiByPiano}/${pianoId}/studenti/report`,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalStudenti = +res.headers.get('X-InlineCount');
          let studenti = res.body as ReportStudente[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: studenti,
            totalRecords: totalStudenti
          };
        }),
        catchError(this.handleError)
      );
  }

  getStudenteReportByIdPage(pianoId: string, studenteId: string, annoScolastico: string, annoCorso: string): Observable<any> {
    return this.http.get<ReportStudente>(
      `${this.reportStudentiByPiano}/${pianoId}/studenti/report`,
      {
        params: {
          annoCorso: annoCorso,
          annoScolastico: annoScolastico,
          studenteId: studenteId
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalStudenti = +res.headers.get('X-InlineCount');
          let studenti = res.body as ReportStudente;
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: studenti,
            totalRecords: totalStudenti
          };
        }),
        catchError(this.handleError)
      );
  }

  getReportClasseById(pianoId: string, annoScolastico?: string, annoCorso?: string): Observable<any> {
    return this.http.get<ReportClasse[]>(
      `${this.reportClasse}`,
      {
        params: {
          annoCorso: annoCorso,
          annoScolastico: annoScolastico,
          pianoId: pianoId
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let report = res.body as ReportClasse[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: report
          };
        }),
        catchError(this.handleError)
      );
  }

  getReportClasseByClasse(pianoId: string, classe: string, annoScolastico: string, annoCorso: string): Observable<any> {
    return this.http.get<ReportClasse>(
      `${this.reportClasse}`,
      {
        params: {
          annoCorso: annoCorso,
          annoScolastico: annoScolastico,
          pianoId: pianoId,
          classe: classe
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let report = res.body as ReportClasse;
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: report
          };
        }),
        catchError(this.handleError)
      );
  }

  getReportStudenteByName(pianoId: string, annoScolastico?: string, annoCorso?: string): Observable<any> {
    return this.http.get<any[]>(
      `${this.reportClasse}`,
      {
        params: {
          annoCorso: annoCorso,
          annoScolastico: annoScolastico,
          pianoId: pianoId
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let report = res.body;
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: report
          };
        }),
        catchError(this.handleError)
      );
  }

  getAttivitaForClasse(pianoid, annoCorso, classe): Observable<any> {
    // `${this.reportStudentiByPiano}/${pianoId}/studenti/report`,
    ///api/programmazione/{pianoid}/attivitaAlternanza?annoCorso=string&classe=string&studenteid=string
    return this.http.get<Attivita[]>(
      `${this.attivitaAlternanza}/${pianoid}/attivitaAlternanza`,
      {
        params: {
          annoCorso: annoCorso,
          classe: classe
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita.body;
        },
          catchError(this.handleError)
        )
      );
  }
  //tipologia
  getAttivitaMancantiForClasse(pianoid, annoCorso, classe): Observable<any> {
    return this.http.get<any[]>(
      `${this.attivitaAlternanza}/${pianoid}/tipologieAttivitaMancanti`,
      {
        params: {
          annoCorso: annoCorso,
          classe: classe,
          individuale: 'false'
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita.body;
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaForStudente(pianoid, annoCorso, studente): Observable<any> {
    return this.http.get<Attivita[]>(
      `${this.attivitaAlternanza}/${pianoid}/attivitaAlternanza`,
      {
        params: {
          annoCorso: annoCorso,
          studenteId: studente
        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita.body;
        },
          catchError(this.handleError)
        )
      );
  }
  //tipologia
  getAttivitaMancantiForStudente(pianoid, annoCorso, studente): Observable<any> {
    return this.http.get<AttivitaPiano[]>(
      `${this.attivitaAlternanza}/${pianoid}/tipologieAttivitaMancanti`,
      {
        params: {
          annoCorso: annoCorso,
          studenteId: studente,

        },
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita.body;
        },
          catchError(this.handleError)
        )
      );
  }

  deleteAttivitaFromProgramma(idAttivita) {
    return this.http.delete<AttivitaPiano[]>(
      `${this.deleteAttivitaEndpoint}/${idAttivita}`, {
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(attivita => {

          return true
        },
          catchError(this.handleError)
        )
      );
  }


  getSingleCompetenzaById(singleId: string): Observable<Competenza> {

    return this.http.get<Competenza>(
      `${this.competenzeEndpointsingleId}/${singleId}`,
      {
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let competenza = res.body as Competenza;
          return competenza
        }));
  };

  getListCompetenzeByIds(ids: any): any {
    if (ids && ids.length != 0) {
      let singleObservables = ids.map((singleIds: string, urlIndex: number) => {
        return this.getSingleCompetenzaById(singleIds)
          .timeout(this.timeout)
          .map(single => single as Competenza)
          .catch((error: any) => {
            console.error('Error loading Single, singleUrl: ' + singleIds, 'Error: ', error);
            return Observable.of(null);
          });
      });

      return Observable.forkJoin(singleObservables);
    } else return Observable.of(null);
    // } else return  Observable.empty<Response>();
  };

  getSingleAttivitaById(singleId): Observable<AttivitaPiano> {
    if (singleId && !isNaN(singleId))
      return this.http.get<AttivitaPiano>(

        `${this.attivitaEndpointsingleId}/${singleId}`,
        {
          observe: 'response'
        }
      )
        .timeout(this.timeout)
        .pipe(
          map(res => {
            let attivita = res.body as AttivitaPiano;
            return attivita
          }));
    else return Observable.of(null);
  };

  getListAttivitaByIds(ids: any): any {
    let singleObservables = ids.map((singleIds: string, urlIndex: number) => {
      return this.getSingleAttivitaById(singleIds)
        .timeout(this.timeout)
        .map(single => single as AttivitaPiano)
        .catch((error: any) => {
          console.error('Error loading Single, singleUrl: ' + singleIds, 'Error: ', error);
          return Observable.of(null);
        });
    });

    return Observable.forkJoin(singleObservables);
  }

  getAttivitaGiornaliere(filter, page?, pageSize?) {
    let params = new HttpParams();

    if (filter.titolo)
      params = params.append('titolo', filter.titolo);
    if (filter.anno)
      params = params.append('annoCorso', filter.anno);
    if (filter.corsoStudioId)
      params = params.append('corsoStudioId', filter.corsoStudioId);
    if (filter.classe)
      params = params.append('classe', filter.classe);
    if (filter.nomeStudente)
      params = params.append('nomeStudente', filter.nomeStudente);
    if (filter.dataInizio)
      params = params.append('dataInizio', filter.dataInizio);
    if (filter.dataFine)
      params = params.append('dataFine', filter.dataFine);
    if (filter.interna)
      params = params.append('interna', filter.interna);
    if (filter.completata != null)
      params = params.append('completata', filter.completata);
    if (filter.individuale != null)
      params = params.append('individuale', filter.individuale);
    if (filter.annoScolastico)
      params = params.append('annoScolastico', filter.annoScolastico);
    
    if (filter.tags) {
      params = params.append('tags', filter.tags);
    }
    if (filter.annoCorso)
      params = params.append('annoCorso', filter.annoCorso);

    if (page >= 0)
      params = params.append('page', page + "");
    if (pageSize)
      params = params.append('size', pageSize + '');

    return this.http.get(this.attivitaGiornalieraListaEndpoint + "/" + this.istitudeId,
      {
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }
  getAttivitaGiornalieraById(id) {
    return this.http.get<Attivita>(this.attivitaGiornalieraListaEndpoint + "/" + id)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaGiornalieraCalendario(idEsperienza) {
    return this.http.get<Attivita>(this.attivitaGiornalieraListaEndpoint + "/calendario/" + idEsperienza)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }
  archiviaAttivitaGiornaliera(corso, state) {
    return this.http.put(this.attivitaGiornalieraListaEndpoint + "/archivio/" + corso.id + "/completata/" + state, {})
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        },
          catchError(this.handleError)
        )
      );
  }


  getAttivitaGiornaliereEccezioni(filter) {
    let params = new HttpParams();
    if (this.istitudeId)
      params = params.append('istitutoId', this.istitudeId);
    if (filter.dataInizio)
      params = params.append('dataInizio', filter.dataInizio);
    if (filter.dataFine)
      params = params.append('dataFine', filter.dataFine);
    if (filter.corsodistudio)
      params = params.append('corsoDiStudioId', filter.corsodistudio);
    if (filter.anno)
      params = params.append('annoCorso', filter.anno);
    if (filter.tipologia)
      params = params.append('tipologia', filter.tipologia);
    return this.http.get(this.attivitaGiornalieraEccezioniEndpoint,
      {
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(eccezioni => {
          return eccezioni
        },
          catchError(this.handleError)
        )
      );
  }

  getEccezioniClasse(classeId): Observable<any> {
    let params = new HttpParams();
    if (this.istitudeId)
      params = params.append('istitutoId', this.istitudeId);
    if (classeId)
      params = params.append('classe', classeId);
    return this.http.get(this.attivitaGiornalieraEccezioniEndpoint,
      {
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(eccezioni => {
          return eccezioni
        },
          catchError(this.handleError)
        )
      );
  }

  getEccezioniStudente(studenteId) {
    let params = new HttpParams();
    if (this.istitudeId)
      params = params.append('istitutoId', this.istitudeId);
    if (studenteId)
      params = params.append('studenteId', studenteId);
    return this.http.get(this.attivitaGiornalieraEccezioniEndpoint,
      {
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(eccezioni => {
          return eccezioni
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaGiornaliereStudenti(filter, page?, pageSize?) {
    let params = new HttpParams();
    if (filter.anno)
      params = params.append('annoCorso', filter.anno);
    if (filter.classe)
      params = params.append('classe', filter.classe);
    if (filter.nome)
      params = params.append('nome', filter.nome);

    if (page >= 0)
      params = params.append('page', page + "");
    if (pageSize)
      params = params.append('size', pageSize + '');

    params = params.append("annoScolastico", config.schoolYear);
    return this.http.get(`${this.attivitaGiornalieraStudentiEndpoint}/${this.istitudeId}/studenti/report`,
      {
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(studenti => {
          return studenti
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaGiornaliereStudenteById(id) {
    return this.http.get(`${this.attivitaGiornalieraStudentiStatusEndpoint}/${id}`)
      .timeout(this.timeout)
      .pipe(
        map(studente => {
          return studente
        },
          catchError(this.handleError)
        )
      );
  }

  saveAttivitaGiornaliereStudentiPresenze(presenzeObject) {
    return this.http.put(this.attivitaGiornalieraListaEndpoint + '/calendario', presenzeObject)
      .timeout(this.timeout)
      .pipe(
        map(studenti => {
          return studenti
        },
          catchError(this.handleError)
        )
      );
  }

  saveAttivitaGiornaliereStudentePresenze(idStudente, idEsperienza, presenze) {
    return this.http.put(this.attivitaGiornalieraStudentiEndpoint + '/' + idEsperienza + '/' + idStudente, presenze)
      .timeout(this.timeout)
      .pipe(
        map(studente => {
          return studente
        },
          catchError(this.handleError)
        )
      );
  }

  getOpportunitaByFilter(page: number, pageSize: number, filtro): Observable<any> {
    var params = new HttpParams()
    if (filtro.tipologia)
      params = params.append("tipologia", filtro.tipologia + "");
    if (filtro.competenze && filtro.competenze.length > 0) {
      params = params.set("competenze", filtro.competenze);
    }
    if (filtro.fromDate)
      params = params.set("dataInizio", filtro.fromDate.valueOf());
    if (filtro.toDate)
      params = params.set("dataFine", filtro.toDate.valueOf());
    if (filtro.coordinates && filtro.coordinates.length > 0)
      params = params.set("coordinate", filtro.coordinates.join());
    if (filtro.distance)
      params = params.set("raggio", filtro.distance);
    if (filtro.istitutoId)
      params = params.set("istitutoId", filtro.istitutoId);
    if (filtro.individuale != null)
      params = params.append('individuale', filtro.individuale);
    if (filtro.titolo != null)
      params = params.append('titolo', filtro.titolo);
    
    params = params.append('page', page + '');
    params = params.append('size', pageSize + '');
    // params = params.append('sort', filtro.order + ',asc');
    params = params.append('orderBy', filtro.order);
    
    return this.http.get<any>(`${this.searchOpportunita}`,
      {
        params: params,
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body;
          return attivita
        },
          catchError(
            this.handleError
          )));
  }

  getOpportunitaById(id) {
    return this.http.get<any>(`${this.opportunitaDetail}/${id}`,
      {
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body;
          return attivita
        },
          catchError(
            this.handleError
          )));
  }

  addOpportunitaToStudente(idPiano, opportunita, studenteId, annoCorso, annoScolastico, competenze?): Observable<any> {

    return this.http.post<any>(`${this.addOpportunita}/${opportunita.id}/gruppo/pianoAlternanza/${idPiano}/annoCorso/${annoCorso}`,
      {
        annoScolastico: annoScolastico,
        dataFine: opportunita.dataFine,
        dataInizio: opportunita.dataInizio,
        ore: opportunita.ore,
        referenteScuola: opportunita.referenteFormazione,
        referenteScuolaCF: opportunita.referenteFormazioneCF,
        titolo: opportunita.titolo,
        competenzeId: competenze.map(competenza => competenza.id),
        studentiId: [studenteId]

      })
      .timeout(this.timeout)
      .pipe(
        map(added => {
          return added
        }),
        catchError(
          this.handleError
        )
      );

  }

  addOpportunitaToGruppo(idPiano, opportunita, annoCorso, annoScolastico, competenze?): Observable<boolean> {
    return this.http.post<any>(`${this.addOpportunita}/${opportunita.id}/gruppo/pianoAlternanza/${idPiano}/annoCorso/${annoCorso}`,
      {
        annoScolastico: annoScolastico,
        dataFine: opportunita.dataFine,
        dataInizio: opportunita.dataInizio,
        ore: opportunita.ore,
        referenteScuola: opportunita.referenteFormazione,
        referenteScuolaCF: opportunita.referenteFormazioneCF,
        titolo: opportunita.titolo,
        competenzeId: competenze.map(competenza => competenza.id)

      })
      .timeout(this.timeout)
      .pipe(
        map(added => {
          return added
        }),
        catchError(
          this.handleError
        )
      );

  }

  getStudentiByFilter(filtro, istitudeId, pageNr, pageSize): Observable<any> {
    var params = new HttpParams()
    if (filtro.corsoId)
      params = params.append("corsoId", filtro.corsoId);
    if (filtro.annoScolastico) {
      params = params.set("annoScolastico", filtro.annoScolastico);
    }
    if (filtro.classe)
      params = params.set("classe", filtro.classe);
    if (filtro.nome)
      params = params.set("nome", filtro.nome);

    params = params.append('page', pageNr);
    params = params.append('size', pageSize);

    return this.http.get<any>(`${this.studentiProfiles}/${istitudeId}`,
      {
        params: params,
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let studenti = res.body;
          return studenti
        },
          catchError(
            this.handleError
          )));
  }

  getClassiOfCorso(corso, annoCorso): Observable<any> {
    var params = new HttpParams()
    if (annoCorso) {
      params = params.append('annoCorso', annoCorso);
    }
    return this.http.get<any>(`${this.classiRegistration}/${corso.courseId}/${this.istitudeId}/${config.schoolYear}`,
      {
        params: params,
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let classi = res.body;
          return classi
        },
          catchError(
            this.handleError
          )));
  }

  solveEccezione(pianoAlternanzaId, idOpp, studenti, competenze, eccezioneId, dataInizio, dataFine): Observable<any> {

    var competenzeString = "";
    var studenteString = "";
    if (studenti) {
      studenteString = "&studenti=" + studenti.map(studente => studente.studenteId).join();
    }
    if (competenze) {
      competenzeString = "&competenze=" + competenze.map(competenze => competenze.id).join();
    }
    return this.http.post<any>(`${this.solveEccezioni}/${idOpp}/studente?pianoAlternanzaId=${pianoAlternanzaId}&attivitaAlternanzaId=${eccezioneId}` + studenteString,
      {

        competenzeId: competenze.map(competenze => competenze.id),
        dataFine: dataFine,
        dataInizio: dataInizio
      }, {
        observe: 'response'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res
        },
          catchError(
            this.handleError
          )));

  }

  downloadschedaValutazioneStudente(id: any): Observable<any> {

    let url = this.host + '/download/schedaValutazioneStudente/' + id;

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

  downloadschedaValutazioneAzienda(id: any): Observable<any> {

    let url = this.host + '/download/schedaValutazioneAzienda/' + id;

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

  getListaIstitutiByIds(ids: any): any {
    let singleObservables = ids.map((singleIds: string, urlIndex: number) => {
      return this.getIstitutoById(singleIds)
        .timeout(this.timeout)
        .map(single => single)
        .catch((error: any) => {
          console.error('Error loading Single, singleUrl: ' + singleIds, 'Error: ', error);
          return Observable.of(null);
        });
    });

    return Observable.forkJoin(singleObservables);
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
  // ### Azienda ###

  //Commented functions are duplicated from azienda front-end

  aziendaId: string = '';
  listAziendaIds = [];
  // istitudeId: string = 'fdef62ac-63bf-4da8-9385-f33d7ee645ec';
  aziendaName: string = "";
  customersBaseUrl: string = '/api/customers';
  ordersBaseUrl: string = '/api/orders';

  competenzeBaseUrl: string = '/api/competenze';

  /** esperienzaSvolta API(s) - CRUD **/
  //test
  esperienzaSvoltaBaseUrl: string = '/api/esperienzaSvolta';
  //real.
  esperienzaSvoltaAPIUrl: string = '/esperienzaSvolta';
  // aa
  attiitaAlternanzaAPIUrl: string = '/attivitaAlternanza'

  attivitaGruppoAPIUrl: string = '/attivitaGruppo';

  /** diarioDiBordo API(s) - CRUD */
  diarioDiBordoAPIUrl: string = "/diarioDiBordo"

  /** oppurtunita API(s) - CRUD **/
  //test
  offersBaseUrl: string = '/api/offers';
  //real.
  opportunitaAPIUrl: string = '/opportunita';


  //Lista aziende API(s)
  aziendeAPIUrl: string = '/aziende';



  orders: IOrder[];
  states: IState[];

  // CRUD /opportunita/{aziendaId}
  opportunitaBaseUrl: string = "/api/opportunita/";


  setAziendaId(id) {
    if (id) {
      this.aziendaId = id;
    }
  }
  setAziendaName(name) {
    if (name) {
      this.aziendaName = name;
    }
  }

  getListaAziende() {
    let url = this.host + this.aziendeAPIUrl + "/" + this.istitudeId;
    console.log(url);
    return this.http.get<Azienda[]>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          console.log(res.body);
          return (res.body as Azienda[]);
        }),
        catchError(this.handleError)
      )
  }

  // GET /azienda/{id}
  getAzienda(aziendaId: any) {
    let url = this.host + "/azienda/" + this.istitudeId + "/"+ aziendaId;

    return this.http.get<Azienda>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body as Azienda;
          return attivita;
        }),
        catchError(this.handleError)
      );

  }

  addAzienda(az): Observable<Azienda> {
    let url = this.host + "/azienda/" + this.istitudeId;
    
    return this.http.post<Azienda>(
      url,
      az,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok) {
            return (res.body as Azienda);
          } else
            return res;
        }
        ),
        catchError(this.handleError))
  }

  updateAzienda(az) {
    let url = this.host + "/azienda/" + this.istitudeId + "/" + az.id;
    return this.http.put(
      url,
      az,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.handleError))
  }

  deleteAzienda(id: number): Observable<boolean> {
    let url = this.host + "/azienda/" + this.istitudeId + "/" + id;
    return this.http.delete<IApiResponse>(
      url,
      { observe: 'response', })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError)
      );
  }

  getAziende(page, pageSize, filters) {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', pageSize);

    if (filters) {
      if (filters.pIva)
        params = params.append('pIva', filters.pIva);
      if (filters.text)
        params = params.append('text', filters.text);
      if (filters.coordinate)
        params = params.append('coordinate', filters.coordinate);
      if (filters.raggio)
        params = params.append('raggio', filters.raggio);
    }

    return this.http.get(
      this.host + "/list/aziende/" + this.istitudeId,
      {
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(users => {
          return (users);
        }),
        catchError(this.handleError)
      );
  }

  /** ACTIVITES/ESPERIENZA SVOLTA API BLOCK. */

  //GET /esperienzaSvolta/
  getEsperienzaSvoltaAPI(dataInizio: any, dataFine: any, stato: any, tipologia: any, filterText: any, terminata:any, nomeStudente:any, page: any, pageSize: any): Observable<IPagedES> {

    let url = this.host + this.esperienzaSvoltaAPIUrl + "/istituto/" + this.istitudeId;

    let headers = new HttpHeaders();
    // headers = headers.append('Access-Control-Allow-Origin', '*');

    let params = new HttpParams();

    if (dataInizio)
      params = params.append('dataInizio', dataInizio);
    if (dataFine)
      params = params.append('dataFine', dataFine);
    if (stato)
      params = params.append('stato', stato);
    if (tipologia)
      params = params.append('tipologia', tipologia);
    if (filterText)
      params = params.append('filterText', filterText);
    if (terminata != null) {
      params = params.append('terminata', terminata);
    }
    if (nomeStudente) {
      params = params.append('nomeStudente', nomeStudente);
    }

    // force individuale to true (students only)
    params = params.append('individuale', 'true');
    params = params.append('page', page);
    params = params.append('size', pageSize);

    return this.http.get<IPagedES>(
      url,
      {
        headers: headers,
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body as IPagedES);

        }),
        catchError(this.handleError)
      );
  }

  getAttivitaAlternanzaForIstitutoAPI(dataInizio: any, dataFine: any, tipologia: any, filterText: any, completata:any, individuale:any, page: any, pageSize: any): Observable<IPagedAA> {

    let url = this.host + this.attivitaGruppoAPIUrl + "/istituto/" + this.istitudeId;
    let headers = new HttpHeaders();
    // headers = headers.append('Access-Control-Allow-Origin', '*');

    let params = new HttpParams();


    if (dataInizio)
      params = params.append('dataInizio', dataInizio);
    if (dataFine)
      params = params.append('dataFine', dataFine);
    if (tipologia)
      params = params.append('tipologia', tipologia);
    if (filterText)
      params = params.append('filterText', filterText);
    if (completata != null)
      params = params.append('completata', completata);
    if (individuale != null)
      params = params.append('individuale', individuale);
    
    params = params.append('page', page);
    params = params.append('size', pageSize);
    

    return this.http.get<IPagedAA>(
      url,
      {
        headers: headers,
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body as IPagedAA);

        }),
        catchError(this.handleError)
      );
  }

  //GET /esperienzaSvolta/details/{id}
  getEsperienzaSvoltaByIdAPI(id: any): Observable<EsperienzaSvolta> {

    let url = this.host + this.esperienzaSvoltaAPIUrl + "/" + this.istitudeId + "/details/" + id;

    return this.http.get<EsperienzaSvolta>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body as EsperienzaSvolta;
          return attivita;
        }),
        catchError(this.handleError)
      );
  }

  //GET /attivitaAlternanza/{id}
  getAttivitaAlternanzaByIdAPI(id: any): Observable<AttivitaAlternanza> {

    let url = this.host + this.attiitaAlternanzaAPIUrl + '/' + id;

    return this.http.get<AttivitaAlternanza>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body as AttivitaAlternanza;
          return attivita;
        }),
        catchError(this.handleError)
      );
  }
  //PUT
  updateAttivitaAlternanzaById(id, attivita) {

    let url = this.host + this.attiitaAlternanzaAPIUrl + '/' + id;

    return this.http.put(url, attivita)
      .timeout(this.timeout)
      .pipe(
        map(attivita => {
          return attivita
        }),
        catchError(this.handleError)

      );
  }
  //PUT
  completaAttivitaAlternanza(id: any, upldatedES: any): any {
    let url = this.host + this.attiitaAlternanzaAPIUrl + '/' + id + '/completa';

    return this.http.put<IApiResponse>(
      url,
      upldatedES,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError));
  }


  // GET /download/schedaValutazioneAzienda/{es_id}
  downloadschedaValutazione(id: any): Observable<Valutazione> {

    let url = this.host + '/download/schedaValutazioneScuola/' + this.istitudeId + '/es/' + id;

    return this.http.get<Valutazione>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body as Valutazione;
        }),
        catchError(this.handleError)
      );
  }

  // upload /upload/schedaValutazioneAzienda/{es_id}
  uploadDocument(file: File, id: string): Observable<Valutazione> {

    let url = this.host + '/upload/schedaValutazioneScuola/' + this.istitudeId + '/es/' + id;
    let formData: FormData = new FormData();
    formData.append('data', file, file.name);
    let headers = new Headers();

    return this.http.post<Valutazione>(url, formData)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res as Valutazione;
        }),
        catchError(this.handleError)
      )
  }

  // remove /remove/schedaValutazioneAzienda/{es_id}
  deleteDocument(id: any): Promise<any> {
    let body = {}

    let url = this.host + '/remove/schedaValutazioneScuola/' + this.istitudeId + "/es/" + id;

    return this.http.delete(url)
      .timeout(this.timeout)
      .toPromise().then(response => {
        return response;
      }
      ).catch(response => this.handleError);
  }

  // POST /schedaValutazioneAzienda/details/{es_id}
  insertValutazioneESAPI(valutazione: Valutazione): Observable<Valutazione> {

    let url = this.host + '/schedaValutazioneAzienda/' + valutazione.id + "/" + this.istitudeId;

    return this.http.post<Valutazione>(url, valutazione,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let attivita = res.body as Valutazione;
          return attivita;
        }),
        catchError(this.handleError)
      );
  }


  // GET /diarioDiBordo/{id}/giorno/{data}
  initDiarioDiBordo(id: any, requestDate: Date): Promise<any> {

    let requestDayFormat = this.apiFormat(requestDate);
    let httpClient = this.http;
    let url = this.host + this.diarioDiBordoAPIUrl + '/' + id + "/giorno/" + requestDayFormat;
    let addGiornoUrl = this.host + this.diarioDiBordoAPIUrl + '/' + id + "/giorno";
    let giornoNuovo: Giornate = { attivitaSvolta: "", data: requestDate, presenza: false, verificata: false, id: null, isModifiedState: true };

    return new Promise<any>((resolve, reject) => {

      console.log(url);
      return this.http.get<Giornate>(url,
        {
          observe: 'response'
        })
        .timeout(this.timeout)
        .toPromise().then(function (res) {
          //  
          let giorno = res.body as Giornate;

          if (giorno) {
            resolve(giorno);
          } else {
            //    console.log(giornoNuovo);
            // create giorno.
            httpClient.post<IApiResponse>(
              addGiornoUrl,
              giornoNuovo,
              { observe: 'response', }
            ).timeout(this.timeout).toPromise().then(function (res) {
              if (res.ok)
                resolve(giornoNuovo);
              else
                reject();
            }, function (err) {
              reject(err);
            }).catch(error => { reject(error) });


          }
        }, function (err) {
          reject(err);
        }).catch(error => { reject(error) })

    });

  }


  apiFormat(D) {
    var yyyy = D.getFullYear().toString();
    var mm = (D.getMonth() + 1).toString(); // getMonth() is zero-based         
    var dd = D.getDate().toString();

    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
  }


  // POST /diarioDiBordo/{id}/giorno
  addGiorno(id: any, giorno: Giornate): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      let url = this.host + this.diarioDiBordoAPIUrl + '/' + id + "/giorno";
      return this.http.post<IApiResponse>(
        url,
        giorno,
        { observe: 'response', }
      ).timeout(this.timeout).toPromise().then(function (res) {
        if (res.ok)
          resolve(true);
        else
          resolve(false);
      }, function (err) {
        reject(err);
      })

    });


  }


  // POST /diarioDiBordo/{id}/giorno
  updateGiorno(id: any, giorno: Giornate) {
    let url = this.host + this.diarioDiBordoAPIUrl + '/' + id + "/giorno";
    return this.http.put<IApiResponse>(
      url,
      giorno,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError))

  }

  // GET /opportunita/{aziendaId}
  getPagedOppurtunitaAPI(dataInizio: any, dataFine: any, tipologia: any, filterText: any, page: any, pageSize: any): Observable<IPagedOffers> {

    let url = this.host + this.opportunitaAPIUrl;

    let params = new HttpParams();

    params = params.append('istitutoId', this.istitudeId);
    if (dataInizio)
      params = params.append('dataInizio', dataInizio);
    if (dataFine)
      params = params.append('dataFine', dataFine);

    params = params.append('page', page);
    params = params.append('size', pageSize);
    if (tipologia)
      params = params.append('tipologia', tipologia);
    if (filterText)
      params = params.append('filterText', filterText);


    return this.http.get<IPagedOffers>(
      url,
      {
        params: params,
        observe: 'response',
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body as IPagedOffers);
        }),
        catchError(this.handleError)
      );
  }

  // GET /opportunita/details/{id}
  getOppurtunitaDetailAPI(id: any) {

    let url = this.host + this.opportunitaAPIUrl + "/" + this.istitudeId + '/details/' + id;

    return this.http.get<IOffer>(
      url,
      {
        observe: 'response',
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let offer = res.body as IOffer;
          return offer;
        }),
        catchError(this.handleError)
      );
  }


  // POST/opportunita/details/
  insertOppurtunitaAPI(offer: IOffer): Observable<IOffer> {
    let url = this.host + this.opportunitaAPIUrl + "/" + this.istitudeId + '/details/';
    return this.http.post<IOffer>(
      url,
      offer,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok) {
            return (res.body as IOffer);
          } else
            return res;
        }
        ),
        catchError(this.handleError))
  }

  // DELETE /opportunita/{id}
  deleteOppurtunita(id: number): Observable<boolean> {
    let url = this.host + this.opportunitaAPIUrl + "/" + this.istitudeId + "/" + id;
    return this.http.delete(
      url,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  // PUT/opportunita/details/{id}
  updateOppurtunita(offer: IOffer) {
    let url = this.host + this.opportunitaAPIUrl + "/" + this.istitudeId + '/details/' + offer.id;
    return this.http.put(
      url,
      offer,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.handleError))
  }


  //DIVERSO
  // PUT /opportunita/{id}/competenze
  updateCompetenzeAzienda(id: any, listComptenze: any) {
    let url = this.host + this.opportunitaAPIUrl + '/' + this.istitudeId + '/' + id + "/competenze";
    return this.http.put<IApiResponse>(
      url,
      listComptenze,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError))

  }


  // PUT /opportunita/competenze/{id}
  updateRiferente(id: any, rId: any): Observable<IOffer> {
    let url = this.host + this.opportunitaAPIUrl + '/' + id + "/referenteAzienda/" + rId;
    return this.http.put<IOffer>(
      url,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res) {
            return (res as IOffer);
          } else
            return res;
        }
        ),
        catchError(this.handleError))

  }

  /** COMPETENZE **/
  //DIVERSO
  getCompetenzeAzienda() {
    return this.http.get<Competenza[]>(
      `${this.competenzeBaseUrl}`,
      { observe: 'response' })
      .timeout(this.timeout)
      .pipe(map(res => {
        let competencies = res.body as Competenza[];
        return competencies;

      }), catchError(this.handleError));

  }

  // @DeleteMapping("/api/esperienzaSvolta/{attivitaAlternanzaId}/{studenteId}")
  deleteEsperienzaSvoltaFromAttivita(attivitaAlternanzaId, studenteId): Observable<boolean> {

    let url = this.host + this.esperienzaSvoltaAPIUrl + '/' + attivitaAlternanzaId + '/' + studenteId;

    return this.http.delete<IApiResponse>(
      url,
      { observe: 'response', }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          if (res.ok)
            return true;
          else
            return res;
        }),
        catchError(this.handleError)
      );
  }

  //DIVERSO
  getAttivitaTipologieAzienda(): Observable<object[]> {
    return this.http.get<object[]>(this.host + "/tipologieTipologiaAttivita")
      .pipe(
        map(tipologie => {
          return tipologie;
        },
          catchError(this.handleError)
        )
      );
  }

  /** OFFER/OPPURTUNITA API BLOCK. */
  getOffersPage(page: number, pageSize: number): Observable<IPagedResults<IOffer[]>> {
    return this.http.get<IOffer[]>(
      `${this.offersBaseUrl}/page/${page}/${pageSize}`,
      { observe: 'response' })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalRecords = +res.headers.get('X-InlineCount');
          let offers = res.body as IOffer[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: offers,
            totalRecords: totalRecords
          };
        }),
        catchError(this.handleError)
      );
  }

  getOffer(id: number): Observable<IOffer> {
    return this.http.get<IOffer>(this.offersBaseUrl + '/' + id)
      .timeout(this.timeout)
      .pipe(
        map(offer => {
          return offer;
        }),
        catchError(this.handleError)
      );
  }

  insertOffer(offer: IOffer): Observable<IOffer> {
    return this.http.post<IOffer>(this.offersBaseUrl, offer)
      .timeout(this.timeout)
      .pipe(catchError(this.handleError))
  }

  updateOffer(offer: IOffer): Observable<boolean> {
    return this.http.put<IApiResponse>(this.offersBaseUrl + '/' + offer.id, offer)
      .timeout(this.timeout)
      .pipe(
        map(res => res.status),
        catchError(this.handleError)
      );
  }

  deleteOffer(id: number): Observable<boolean> {
    return this.http.delete<IApiResponse>(this.offersBaseUrl + '/' + id)
      .timeout(this.timeout)
      .pipe(
        map(res => res.status),
        catchError(this.handleError)
      );
  }

  /** TEST ENVIRONMENT. */
  getEsperienzaSvolta(page: number, pageSize: number): Observable<IPagedResults<EsperienzaSvolta[]>> {
    return this.http.get<EsperienzaSvolta[]>(
      `${this.esperienzaSvoltaBaseUrl}/page/${page}/${pageSize}`,
      { observe: 'response' })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          const totalRecords = +res.headers.get('X-InlineCount');
          let offers = res.body as EsperienzaSvolta[];
          //    this.calculateCustomersOrderTotal(customers);
          return {
            results: offers,
            totalRecords: totalRecords
          };
        }),
        catchError(this.handleError)
      );
  }

  getEsperienzaSvoltaById(id: number): Observable<EsperienzaSvolta> {
    return this.http.get<EsperienzaSvolta>(this.esperienzaSvoltaBaseUrl + '/' + id)
      .timeout(this.timeout)
      .pipe(
        map(activity => {
          return activity;
        }),
        catchError(this.handleError)
      );
  }


  //NOTE
  saveNoteAzienda(esperienzaId, nota) {
    let params = new HttpParams();
    params = params.append('note', nota);
    return this.http.post(this.host + this.esperienzaSvoltaAPIUrl + "/" + this.istitudeId + "/noteAzienda/" + esperienzaId, {},
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

  //DIVERSO
  saveAttivitaGiornaliereStudentiPresenzeAzienda(presenzeObject) {
    return this.http.put(this.attivitaGiornalieraListaEndpoint + '/calendario', presenzeObject,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(studenti => {
          return studenti
        },
          catchError(this.handleError)
        )
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
        catchError(this.handleError))
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

    let displayGrowl:boolean = true;
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