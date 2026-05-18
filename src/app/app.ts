import { Component, OnInit } from '@angular/core';
import { Player } from './models/player';
import { PlayersComponent } from './components/players/players';
import { DetailComponent } from './components/detail/detail';
import { MediaComponent } from './components/media/media';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayersComponent, DetailComponent, MediaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  selectedPlayer: Player | null = null;

  constructor(private notificationService: NotificationService) {}

  async ngOnInit(): Promise<void> {
    // Solicitar permisos de notificación y obtener token FCM
    await this.notificationService.requestPermission();

    // Escuchar notificaciones en foreground
    this.notificationService.listenForMessages((payload) => {
      const title = payload.notification?.title || 'Notificación';
      const body = payload.notification?.body || '';

      // Mostrar notificación en la UI
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      } else {
        alert(`${title}: ${body}`);
      }
    });
  }

  onPlayerSelected(player: Player): void {
    this.selectedPlayer = player;
  }

  clearSelection(): void {
    this.selectedPlayer = null;
  }
}
