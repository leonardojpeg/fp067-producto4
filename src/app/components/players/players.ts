import { Component, EventEmitter, Output } from '@angular/core';
// Como estamos usando [(ngModel)], necesita FormsModule.
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { PLAYERS } from '../../data/players';
import { PlayerFilterPipe } from '../../pipes/player-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerFilterPipe],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class PlayersComponent {
  @Output() playerSelected = new EventEmitter<Player>();

  players: Player[] = PLAYERS;
  selectedPlayerId: number | null = null;

  searchText: string = '';
  selectedPosition: string = 'Todas';

  positions: string[] = ['Todas', 'Base', 'Escolta', 'Alero', 'Pívot'];

  selectPlayer(player: Player): void {
    this.selectedPlayerId = player.id;
    this.playerSelected.emit(player);
  }
}