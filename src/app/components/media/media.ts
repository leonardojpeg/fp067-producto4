import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media.html',
  styleUrl: './media.css'
})
export class MediaComponent implements OnChanges {
  @Input() player: Player | null = null;
  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  currentTime = 0;
  duration = 0;
  volume = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] && !changes['player'].firstChange) {
      setTimeout(() => {
        if (this.videoRef?.nativeElement) {
          const video = this.videoRef.nativeElement;
          video.pause();
          video.load();
          this.currentTime = 0;
          this.duration = 0;
          this.volume = 1;
          video.volume = 1;
        }
      });
    }
  }

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
    const newVolume = Number(input.value);

    video.volume = newVolume;
    this.volume = newVolume;
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

  getProgressPercent(): string {
    if (!this.duration || this.duration <= 0) {
      return '0%';
    }

    return `${(this.currentTime / this.duration) * 100}%`;
  }

  getVolumePercent(): string {
    return `${this.volume * 100}%`;
  }
}