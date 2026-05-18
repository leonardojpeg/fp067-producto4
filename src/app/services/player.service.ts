import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private firestore: Firestore) {}

  getPlayers(): Observable<Player[]> {
    const playersRef = collection(this.firestore, 'players');
    return collectionData(playersRef, { idField: 'id' }) as Observable<Player[]>;
  }

  addPlayer(player: Player) {
    const playersRef = collection(this.firestore, 'players');
    return addDoc(playersRef, player);
  }

  deletePlayer(id: string) {
    const playerDoc = doc(this.firestore, `players/${id}`);
    return deleteDoc(playerDoc);
  }

  updatePlayer(id: string, player: Player) {
    const playerDoc = doc(this.firestore, `players/${id}`);

    // eliminar id antes de enviar a Firestore
    const { id: _, ...playerData } = player;

    return updateDoc(playerDoc, playerData);
  }
}