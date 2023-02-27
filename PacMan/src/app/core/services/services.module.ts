import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacadeService } from './facade.service';
import { LobbyService } from './/lobby.service';
import { ClientService } from './client.service';
import { MapService } from './map.service';
import { SignalRService } from './signalR.service';
import { MediatorService } from './mediator.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    LobbyService,
    ClientService,
    MapService,
    SignalRService,
    MediatorService,
    FacadeService,
  ],
})
export class ServicesModule {}
