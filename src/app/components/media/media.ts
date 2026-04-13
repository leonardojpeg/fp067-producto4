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
        const video = this.videoRef?.nativeElement;
        if (video) {
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

  private get video(): HTMLVideoElement | null {
    return this.videoRef?.nativeElement || null;
  }

  play(): void {
    this.video?.play();
  }

  pause(): void {
    this.video?.pause();
  }

  stop(): void {
    if (this.video) {
      this.video.pause();
      this.video.currentTime = 0;
      this.currentTime = 0;
    }
  }

  setVolume(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (this.video) {
      this.video.volume = value;
      this.volume = value;
    }
  }

  updateProgress(video: HTMLVideoElement): void {
    this.currentTime = video.currentTime;
    this.duration = video.duration || 0;
  }

  seek(event: Event): void {
    const time = Number((event.target as HTMLInputElement).value);
    if (this.video) {
      this.video.currentTime = time;
      this.currentTime = time;
    }
  }

  onLoadedMetadata(video: HTMLVideoElement): void {
    this.duration = video.duration || 0;
  }

  getProgressPercent(): string {
    if (!this.duration) return '0%';
    return `${(this.currentTime / this.duration) * 100}%`;
  }

  getVolumePercent(): string {
    return `${this.volume * 100}%`;
  }
}