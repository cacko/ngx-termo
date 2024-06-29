import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { API, NowDataEntity, PERIOD } from '../entity/api.entity';
import { inject } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { Moment } from 'moment';
import { LoaderService } from './loader.service';
import { NowDataModel } from '../models/nowdata.model';
import { SensorLocation } from '../entity/location.emtity';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private uid: string = "dev"

  private readySubject = new Subject<boolean>();
  ready = this.readySubject.asObservable();
  protected readonly storage = inject(LocalStorageService);
  protected readonly http = inject(HttpClient);

  userToken = '';

  constructor(
    private loader: LoaderService
  ) {
    this.storage.remove("last_modified");
    this.storage.remove("entities");
  }


  get headers(): HttpHeaders {
    return new HttpHeaders({
      "X-User-Token": this.userToken
    });
  }


  private get lastModified(): Moment | null {
    return this.storage.get("last_modified");
  }

  private set lastModified(value: Moment) {
    this.storage.set("last_modified", value);
  }

  // private get entities(): GeneratedEntitty[] {
  //   return this.storage.get("entities") || [];
  // }

  // private set entities(value: GeneratedEntitty[]) {
  //   this.storage.set("entities", value);
  // }

  private getAction(location: SensorLocation, period: PERIOD) {
    return `${period}/${location}`;
  }


  getHistory(
    location: SensorLocation,period: PERIOD,useCache: boolean = true): Observable<NowDataModel[]> {
    return new Observable((subscriber: any) => {
      // const entities = this.entities;
      // const idx = findIndex(entities, { slug: id });
      // if (idx > -1 && useCache) {
      //   subscriber.next(entities[idx]);
      //   return;
      // }

      this.loader.show();
      this.http.get(`${API.URL}/${this.getAction(location, period)}`, {
        headers: this.headers,
        withCredentials: true,
      }).subscribe({
        next: (data: any) => {
          const models = (data as NowDataEntity[]).map((m) => new NowDataModel(m));
          subscriber.next(models);
        },
        error: (error: any) => console.debug(error),
        complete: () => {
          this.loader.hide();
        },
      });
    });
  }

  //   getGenerations(): any {
  //     return new Observable((subscriber: any) => {
  //       let lastModified = this.lastModified;
  //       if (lastModified) {
  //         subscriber.next(this.entities);
  //         return;
  //       }
  //       lastModified = moment.unix(0).utc();
  //       this.http.get(`${API.URL}/${API.ACTION_GENERATED}`, {
  //         headers: this.headers,
  //         withCredentials: true,
  //         observe: 'response',
  //         params: { limit: 10, last_modified: lastModified.format() }
  //       }).pipe(
  //         expand((res) => {
  //           const nextPage = res.headers.get('x-pagination-next');
  //           const pageNo = parseInt(String(res.headers.get('x-pagination-page')));
  //           return nextPage
  //             ? this.http.get(nextPage, {
  //               headers: { 'X-User-Token': this.userToken },
  //               observe: 'response',
  //             }).pipe(delay(100))
  //             : EMPTY;
  //         }),
  //         reduce((acc, current): any => {
  //           const data = current.body as GeneratedEntitty[];
  //           const pageNo = parseInt(String(current.headers.get('x-pagination-page')));
  //           return concat(acc, data);
  //         }, []),
  //         tap((res) => {
  //           this.entities = res;
  //           this.lastModified = moment().utc();
  //         })).subscribe({
  //           next: (data: any) => {
  //             subscriber.next(data);
  //           },
  //           error: (error: any) => console.debug(error),
  //         });
  //     });
  //   }
}


// export const generatedResolver: ResolveFn<GeneratedEntitty> = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   const id = route.paramMap.get('id')!;
//   return inject(ApiService).getGenerated(id);
// };

// export const generationsResolver: ResolveFn<GeneratedEntitty[]> = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   return inject(ApiService).getGenerations();
// };

