import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Player } from '../../models/player';
import { PlayerFilterPipe } from '../../pipes/player-filter.pipe';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerFilterPipe],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class PlayersComponent implements OnInit {

  @Output() playerSelected = new EventEmitter<Player>();

  players: Player[] = [];
  selectedPlayerId: string | null = null;

  searchText: string = '';
  selectedPosition: string = 'Todas';

  positions: string[] = ['Todas', 'Base', 'Escolta', 'Alero', 'Pívot'];

  // FORM NUEVO JUGADOR
  newPlayer: Player = this.resetPlayer();

  // FEEDBACK
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(data => {
      this.players = data;
    });
  }

  selectPlayer(player: Player): void {
    this.selectedPlayerId = player.id ?? null;
    this.playerSelected.emit(player);
  }

  // DELETE
  deletePlayer(id: string): void {
    this.playerService.deletePlayer(id);
  }

  // CREATE con validación
  addPlayer(): void {

    this.clearMessages();

    if (!this.isValidPlayer(this.newPlayer)) {
      this.errorMessage = 'Todos los campos obligatorios deben estar rellenos correctamente';
      return;
    }

    this.playerService.addPlayer(this.newPlayer)
      .then(() => {
        this.successMessage = 'Jugador añadido correctamente';
        this.newPlayer = this.resetPlayer();
      })
      .catch(() => {
        this.errorMessage = 'Error al guardar el jugador';
      });
  }

  // VALIDACIÓN
  isValidPlayer(player: Player): boolean {
    return !!(
      player.nombre?.trim() &&
      player.apellidos?.trim() &&
      player.posicion?.trim() &&
      player.equipo?.trim() &&
      player.edad !== null && player.edad > 0 &&
      player.dorsal !== null && player.dorsal > 0
    );
  }

  // RESET FORM 
  resetPlayer(): Player {
    return {
      nombre: '',
      apellidos: '',
      posicion: '',
      edad: null as any,     
      altura: '',
      dorsal: null as any,   
      equipo: '',
      estado: 'Disponible',  
      perfil: '',
      video: '',
      imagen: 'assets/images/player-placeholder.jpg'
    };
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}