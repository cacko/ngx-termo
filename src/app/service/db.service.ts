import { Injectable, inject } from '@angular/core';
import { Database, ref, stateChanges, DataSnapshot, } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject, of, throwError, } from 'rxjs';
import { NowDataEntity,  } from '../entity/api.entity';
import { NowDataModel } from '../models/nowdata.model';
import { SensorLocation } from '../entity/location.emtity';
import { toPairs } from 'lodash-es';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private indoorSubject = new BehaviorSubject<NowDataModel | null>(null);
  $indoor = this.indoorSubject.asObservable();

  private outdoorSubject = new BehaviorSubject<NowDataModel | null>(null);
  $outdoor = this.outdoorSubject.asObservable();

  constructor(
    private db: Database = inject(Database)
  ) { }

  init() {
    const path = `termo`;
    const list = ref(this.db, path);
    stateChanges(list).subscribe((change: any) => {
      const snapshot: DataSnapshot = change.snapshot;
      const data = snapshot.val() as NowDataEntity;
      switch (data.location) {
        case SensorLocation.INDOOR:
          this.indoorSubject.next(new NowDataModel(data));
          break;
        case SensorLocation.OUTDOOR:
          this.outdoorSubject.next(new NowDataModel(data));
          break;
      }
    }
    )
  }

  forSensor(sensor: SensorLocation): Observable<NowDataModel | null> {
    switch (sensor) {
      case SensorLocation.INDOOR:
        return this.$indoor;
      case SensorLocation.OUTDOOR:
        return this.$outdoor;
      default:
        throw new TypeError('no such location');
    }
  }

  deInit() {

  }

}
