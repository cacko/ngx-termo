import { ApplicationConfig, Injectable } from '@angular/core';
import { Database, ref, stateChanges, DataSnapshot, objectVal } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject, Subscription, endWith } from 'rxjs';
import { NowDataEntity } from '../entity/api.entity';
import { NowDataModel } from '../models/nowdata.model';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private changeSubject = new BehaviorSubject<NowDataModel | null>(null);
  $change = this.changeSubject.asObservable();

  constructor(
    private db: Database
  ) { }

  init() {
    const path = `termo`;
    const list = ref(this.db, path);
    stateChanges(list).subscribe((change: any) => {
      const snapshot: DataSnapshot = change.snapshot;
      const data = snapshot.val() as NowDataEntity;
      this.changeSubject.next(new NowDataModel(data));
    });
  }

  deInit() {

  }

}
