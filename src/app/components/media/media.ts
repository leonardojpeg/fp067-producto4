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

  currentTime = 0;
  duration = 0;

  play(video: HTMLVideoElement): void {
    video.play();
  }

  pause(video: HTMLVideoElement): void {
    video.pause();
  }

  stop(video: HTMLVideoElement): void {
    video.pause();
    video.currentTime = 0;
    this.currentTime = 0;
  }

  setVolume(video: HTMLVideoElement, event: Event): void {
    const input = event.target as HTMLInputElement;
    video.volume = Number(input.value);
  }

  updateProgress(video: HTMLVideoElement): void {
    this.currentTime = video.currentTime;
    this.duration = video.duration || 0;
  }

  seek(video: HTMLVideoElement, event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = Number(input.value);
    video.currentTime = time;
    this.currentTime = time;
  }

  onLoadedMetadata(video: HTMLVideoElement): void {
    this.duration = video.duration || 0;
  }
}