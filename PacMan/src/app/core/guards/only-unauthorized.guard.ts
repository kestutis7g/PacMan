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
export class OnlyUnauthorizedGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private clientService: ClientService) {
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
    // if (this.clientService.isAuthenticated) {
    //   this.router.navigate(['/payment/list']);
    //   return false;
    // }

    return true;
  }
}
