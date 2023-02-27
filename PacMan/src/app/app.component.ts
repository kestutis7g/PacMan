import { Component, HostListener } from '@angular/core';
import { SignalRService } from './core/services/signalR.service';
import { MediatorService } from './core/services/mediator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'PacMan';
  constructor(
    private signalRService: SignalRService,
    private mediatorService: MediatorService
  ) {}
}
