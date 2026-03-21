import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media.html',
  styleUrl: './media.css'
})
export class MediaComponent {
  @Input() player: Player | null = null;

  play(video: HTMLVideoElement): void {
    video.play();
  }

  pause(video: HTMLVideoElement): void {
    video.pause();
  }

  stop(video: HTMLVideoElement): void {
    video.pause();
    video.currentTime = 0;
  }

  setVolume(video: HTMLVideoElement, event: Event): void {
    const input = event.target as HTMLInputElement;
    video.volume = Number(input.value);
  }
}