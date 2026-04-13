import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Player } from '../../models/player';
import { PlayerFilterPipe } from '../../pipes/player-filter.pipe';
import { PlayerService } from '../../services/player.service';

// FIREBASE STORAGE
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  newPlayer: Player = this.resetPlayer();

  successMessage: string = '';
  errorMessage: string = '';

  // 🔥 CONTROL DE SUBIDA
  isUploadingImage: boolean = false;
  isUploadingVideo: boolean = false;

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

  deletePlayer(id: string): void {
    this.playerService.deletePlayer(id);
  }

  // =========================
  // CREATE
  // =========================
  addPlayer(): void {

    this.clearMessages();

    // 🔥 BLOQUEO SI ESTÁ SUBIENDO
    if (this.isUploadingImage || this.isUploadingVideo) {
      this.errorMessage = 'Espera a que terminen de subirse los archivos';
      return;
    }

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

  // =========================
  // SUBIR IMAGEN
  // =========================
  async uploadImage(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploadingImage = true;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `players/images/${Date.now()}_${file.name}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      this.newPlayer.imagen = url;

    } catch (error) {
      console.error(error);
      this.errorMessage = 'Error al subir la imagen';
    } finally {
      this.isUploadingImage = false;
    }
  }

  // =========================
  // SUBIR VIDEO
  // =========================
  async uploadVideo(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploadingVideo = true;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `players/videos/${Date.now()}_${file.name}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      this.newPlayer.video = url;

    } catch (error) {
      console.error(error);
      this.errorMessage = 'Error al subir el vídeo';
    } finally {
      this.isUploadingVideo = false;
    }
  }

  // =========================
  // VALIDACIÓN
  // =========================
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

  // =========================
  // RESET FORM
  // =========================
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
      imagen: ''
    };
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}