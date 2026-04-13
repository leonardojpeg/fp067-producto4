import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Player } from '../../models/player';
import { PlayerService } from '../../services/player.service';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class DetailComponent {

  @Input() player: Player | null = null;
  @Output() closeDetail = new EventEmitter<void>();

  editMode: boolean = false;

  constructor(private playerService: PlayerService) {}

  close(): void {
    this.closeDetail.emit();
  }

  enableEdit(): void {
    this.editMode = true;
  }

  async savePlayer(): Promise<void> {
    if (this.player?.id) {
      await this.playerService.updatePlayer(this.player.id, this.player);
      this.editMode = false;
    }
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  // SUBIR IMAGEN
  async uploadImage(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file || !this.player) return;

    const storage = getStorage();
    const storageRef = ref(storage, `players/images/${Date.now()}_${file.name}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    this.player.imagen = url;

    // guardar en firestore
    if (this.player.id) {
      await this.playerService.updatePlayer(this.player.id, this.player);
    }
  }

  // SUBIR VIDEO
  async uploadVideo(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file || !this.player) return;

    const storage = getStorage();
    const storageRef = ref(storage, `players/videos/${Date.now()}_${file.name}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    this.player.video = url;

    // guardar en firestore
    if (this.player.id) {
      await this.playerService.updatePlayer(this.player.id, this.player);
    }
  }
}