import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chatMessage.model';
import Swal from 'sweetalert2';
import { Client, GameObject } from '../models/game.types';
import { PlatformLocation } from '@angular/common';
import { FacadeService } from '../core/services/facade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  signalrConnectionEstablished?: Observable<boolean>;
  chatmessages: ChatMessage[] = [];

  playerName: string = '';
  constructor(
    private router: Router,
    private facadeService: FacadeService,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      this.router.navigate(['/home']).then(() => {});
    });
  }

  ngOnInit() {
    this.playerName =
      sessionStorage.getItem('playerName') ||
      'Player_' + Math.floor(Math.random() * (999 - 100) + 100).toString();
    sessionStorage.removeItem('lobbyId');

    if (sessionStorage.getItem('playerId')) {
      this.facadeService
        .getClientById(sessionStorage.getItem('playerId')!)
        .subscribe({
          error: (error) => {
            this.resetClient();
          },
        });
    }

    this.signalrConnectionEstablished =
      this.facadeService.signalRService.connectionEstablished;

    this.facadeService.signalRService.messageReceived.subscribe((message) => {
      this.chatmessages.push(message);
    });
  }

  resetClient() {
    sessionStorage.removeItem('playerId');
    sessionStorage.removeItem('playerName');
  }

  createClient() {
    if (!this.playerName || this.playerName.replace(/\s/g, '').length <= 5) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid name',
        text: 'Please choose your name with at least 5 characters',
      });
      return;
    }

    if (
      !sessionStorage.getItem('playerId') ||
      !sessionStorage.getItem('playerName')
    ) {
      let client: Client = {
        name: this.playerName,
        created: new Date().toISOString(),
      };

      this.facadeService.createClient(client);
      client = this.facadeService.signalRService.createdClient;

      Swal.fire({
        title: 'Creating your client!',
        timer: 2000,
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
          sessionStorage.setItem('playerName', this.playerName);
        },
        willClose: () => {
          client = this.facadeService.signalRService.createdClient;
          sessionStorage.setItem('playerId', client.id!);
        },
      }).then((result) => {
        this.router.navigate(['/lobbies']).then(() => {
          //window.location.reload();
        });
      });
    } else if (sessionStorage.getItem('playerName') != this.playerName) {
      let client: Client = {
        name: this.playerName,
      };
      this.facadeService
        .updateClient(sessionStorage.getItem('playerId')!, client)
        .subscribe({
          next: (data) => {
            sessionStorage.setItem('playerName', this.playerName);
            this.router.navigate(['/lobbies']).then(() => {
              //window.location.reload();
            });
          },
          error: (error) => {
            console.log(error);
            if (error.status == 500 || error.status == 403) {
              Swal.fire({
                icon: 'error',
                title: 'Invalid name',
                text: 'Please enter valid name',
              });
            }
          },
        });
    } else {
      this.router.navigate(['/lobbies']).then(() => {
        //window.location.reload();
      });
    }
  }
}
