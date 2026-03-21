import { Component } from '@angular/core';
import { Player } from './models/player';
import { PlayersComponent } from './components/players/players';
import { DetailComponent } from './components/detail/detail';
import { MediaComponent } from './components/media/media';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayersComponent, DetailComponent, MediaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedPlayer: Player | null = null;

  onPlayerSelected(player: Player): void {
    this.selectedPlayer = player;
  }

  clearSelection(): void {
    this.selectedPlayer = null;
  }
}