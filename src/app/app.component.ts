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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { interval } from 'rxjs';
import { BackgroundComponent } from './component/background/background.component';

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
    BackgroundComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'termo';
  $user = this.userService.user;

  constructor(
    private router: Router,
    private iconRegister: MatIconRegistry,
    private userService: UserService,
    private db: DatabaseService,
    public loader: LoaderService,
    private swUpdate: SwUpdate,
    private analytics: Analytics = inject(Analytics)
  ) {
    this.iconRegister.setDefaultFontSetClass('material-symbols-sharp');
    setAnalyticsCollectionEnabled(this.analytics, true);

    this.userService.user.subscribe((res) => {
      if (res?.uid) {
        this.db.init();
      } else {
        this.db.deInit();
      }
      this.loader.hide();
    });
    this.userService.init();
    this.userService.login();
    if (isDevMode() === false) {
      this.swUpdate.versionUpdates.subscribe((evt: VersionEvent) => {
        if (evt.type == 'VERSION_READY') {
          this.swUpdate
            .activateUpdate()
            .then(() => document.location.reload())
        }
      });
      interval(20000).subscribe(() => this.swUpdate.checkForUpdate());
      this.swUpdate.checkForUpdate();
    }
  }

  ngOnInit(): void {
  }
}
