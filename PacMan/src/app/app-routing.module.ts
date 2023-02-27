import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LobbiesComponent } from './lobbies/lobbies.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameOnlyAuthorizedGuard } from './core/guards/game-only-authorized.guard';
import { LobbiesOnlyAuthorizedGuard } from './core/guards/lobbies-only-authorized.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'lobbies',
    component: LobbiesComponent,
    canActivate: [LobbiesOnlyAuthorizedGuard],
  },
  {
    path: 'game/:id',
    component: GameBoardComponent,
    canActivate: [GameOnlyAuthorizedGuard],
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
