import { ApplicationConfig, Injectable } from '@angular/core';
import { Database, ref, stateChanges, DataSnapshot, objectVal } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject, Subscription, endWith } from 'rxjs';
import { NowDataEntity, SensorLocation } from '../entity/api.entity';
import { NowDataModel } from '../models/nowdata.model';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private indoorSubject = new BehaviorSubject<NowDataModel | null>(null);
  $indoor = this.indoorSubject.asObservable();

  private outdoorSubject = new BehaviorSubject<NowDataModel | null>(null);
  $outdoor = this.outdoorSubject.asObservable();

  constructor(
    private db: Database
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

    });
  }

  deInit() {

  }

}
