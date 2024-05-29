import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideNgxLocalstorage } from 'ngx-localstorage';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({ "projectId": "termo-4737a", "appId": "1:209714240984:web:333359098bf047457026ad", "databaseURL": "https://termo-4737a-default-rtdb.europe-west1.firebasedatabase.app", "storageBucket": "termo-4737a.appspot.com", "apiKey": "AIzaSyA1jm_a83ypblE45XcH-uJvEqW2MKVq-2I", "authDomain": "termo-4737a.firebaseapp.com", "messagingSenderId": "209714240984", "measurementId": "G-SM98NYMPTD" })), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideDatabase(() => getDatabase()), provideNgxLocalstorage({
    prefix: "termo"
  }), provideHttpClient(), provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  })]
};
