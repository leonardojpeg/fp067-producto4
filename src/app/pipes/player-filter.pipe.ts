import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
  name: 'playerFilter',
  standalone: true
})
export class PlayerFilterPipe implements PipeTransform {
  transform(players: Player[], searchText: string, selectedPosition: string): Player[] {
    if (!players) {
      return [];
    }

    const text = searchText?.toLowerCase().trim() || '';
    const position = selectedPosition?.toLowerCase().trim() || '';

    return players.filter((player) => {
      const matchesText =
        !text ||
        player.nombre.toLowerCase().includes(text) ||
        player.apellidos.toLowerCase().includes(text);

      const matchesPosition =
        !position ||
        position === 'todas' ||
        player.posicion.toLowerCase() === position;

      return matchesText && matchesPosition;
    });
  }
}