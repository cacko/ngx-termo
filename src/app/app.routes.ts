import { Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
    AuthGuard,
    redirectUnauthorizedTo,
    redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { NowComponent } from './component/now/now.component';


/** add redirect URL to login */
const redirectUnauthorizedToLogin = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return redirectUnauthorizedTo(`/login?redirectTo=${state.url}`);
};

/** Uses the redirectTo query parameter if available to redirect logged in users, or defaults to '/' */
const redirectLoggedInToPreviousPage = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let redirectUrl = '/';
    try {
        const redirectToUrl = new URL(state.url, location.origin);
        const params = new URLSearchParams(redirectToUrl.search);
        redirectUrl = params.get('redirectTo') || '/';
    } catch (err) {
        // invalid URL
    }
    return redirectLoggedInTo(redirectUrl);
};


export const routes: Routes = [
    {
        path: '',
        component: NowComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
    },
];
