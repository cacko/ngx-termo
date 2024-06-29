import { Component, OnInit, inject, isDevMode } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Analytics, setAnalyticsCollectionEnabled } from '@angular/fire/analytics';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { UserService } from './service/user.service';
import { DatabaseService } from './service/db.service';
import { LoaderService } from './service/loader.service';
import { LoaderComponent } from './component/loader/loader.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { interval } from 'rxjs';
import { BackgroundComponent } from './component/background/background.component';
import { TimeService } from './service/time.service';
import moment from 'moment-timezone';
import { ClockComponent } from './component/clock/clock.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatIconModule,
    LoaderComponent,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    BackgroundComponent,
    ClockComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'termo';
  $user = this.userService.user;
  $loader = this.loader.$visible;

  constructor(
    private iconRegister: MatIconRegistry = inject(MatIconRegistry),
    private userService: UserService,
    private db: DatabaseService,
    private loader: LoaderService,
    private swUpdate: SwUpdate = inject(SwUpdate),
    private timeService: TimeService,
    // private analytics: Analytics = inject(Analytics)
  ) {
    this.timeService.start();
    this.loader.show();
    this.iconRegister.setDefaultFontSetClass('material-symbols-sharp');


    this.userService.user.subscribe((res) => {
      if (res?.uid) {
        this.db.init();
      } else {
        this.db.deInit();
      }
      this.loader.hide();
    });
    this.userService.init();
    if (isDevMode() === false) {
      this.swUpdate.versionUpdates.subscribe((evt: VersionEvent) => {
        if (evt.type == 'VERSION_READY') {
          this.swUpdate
            .activateUpdate()
            .then(() => document.location.reload())
        }
      });
      interval(20000).subscribe(() => this.swUpdate.checkForUpdate());
    }
  }

  ngOnInit(): void {
  }
}
