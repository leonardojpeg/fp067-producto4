import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  listVal,
  push,
  remove,
  update
} from '@angular/fire/database';

import { Observable } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private db: Database) {}

  getPlayers(): Observable<Player[]> {
    const playersRef = ref(this.db, '/');
    
    return listVal(playersRef, { keyField: 'id' }) as Observable<Player[]>;
  }

  addPlayer(player: Player) {
    const playersRef = ref(this.db, '/');
    return push(playersRef, player);
  }

  deletePlayer(id: string) {
    const playerRef = ref(this.db, `/${id}`);
    return remove(playerRef);
  }

  updatePlayer(id: string, player: Player) {
    const playerRef = ref(this.db, `/${id}`);
    
    const { id: _, ...playerData } = player;
    return update(playerRef, playerData);
  }
}