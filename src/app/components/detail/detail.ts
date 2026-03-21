import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class DetailComponent {
  @Input() player: Player | null = null;
  @Output() closeDetail = new EventEmitter<void>();

  close(): void {
    this.closeDetail.emit();
  }
}