import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Router,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ClientService } from '../services/client.service';

@Injectable({ providedIn: 'root' })
export class LobbiesOnlyAuthorizedGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {
    // Nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.canAccess();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canAccess();
  }

  public canAccess(): boolean {
    //console.log(sessionStorage.getItem('playerId'));
    if (sessionStorage.getItem('playerId')) {
      return true;
    }

    this.router.navigate(['/home']);

    return false;
  }
}
