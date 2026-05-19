import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  onValue,
  push,
  remove,
  update,
  set
} from '@angular/fire/database';

import { Observable } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private db: Database) {}

  getPlayers(): Observable<Player[]> {
    return new Observable<Player[]>(subscriber => {
      const playersRef = ref(this.db, 'players');
      onValue(playersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const players: Player[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          subscriber.next(players);
        } else {
          subscriber.next([]);
        }
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  addPlayer(player: Player) {
    const playersRef = ref(this.db, 'players');
    const { id, ...playerData } = player;
    return push(playersRef, playerData);
  }

  deletePlayer(id: string) {
    const playerRef = ref(this.db, `players/${id}`);
    return remove(playerRef);
  }

  updatePlayer(id: string, player: Player) {
    const playerRef = ref(this.db, `players/${id}`);
    const { id: _, ...playerData } = player;
    return update(playerRef, playerData);
  }
}
