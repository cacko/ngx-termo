import { Routes } from '@angular/router';
import { NowComponent } from './component/now/now.component';

export const routes: Routes = [
    {
        path: '',
        component: NowComponent,
        pathMatch: 'full'
    },
];
