const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Trigger: cuando se CREA un nuevo jugador en la BD
 * Envía notificación push a todos los dispositivos suscritos al topic 'all'
 * (Angular web + React Native móvil)
 */
exports.onNewPlayer = functions.database
  .ref('/{playerId}')
  .onCreate(async (snapshot, context) => {
    const newPlayer = snapshot.val();

    const payload = {
      notification: {
        title: '🆕 Nuevo jugador añadido',
        body: `${newPlayer.nombre} ${newPlayer.apellidos} - ${newPlayer.equipo} (${newPlayer.posicion})`,
      },
      data: {
        playerId: context.params.playerId,
        type: 'new_player',
        nombre: newPlayer.nombre || '',
        equipo: newPlayer.equipo || ''
      }
    };

    try {
      const response = await admin.messaging().sendToTopic('all', payload);
      console.log('Notificación onCreate enviada correctamente:', response);
      return response;
    } catch (error) {
      console.error('Error enviando notificación onCreate:', error);
      return null;
    }
  });

/**
 * Trigger: cuando se ACTUALIZA un jugador en la BD
 * Envía notificación push informando del cambio
 */
exports.onUpdatePlayer = functions.database
  .ref('/{playerId}')
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();

    const payload = {
      notification: {
        title: '🔄 Jugador actualizado',
        body: `${after.nombre} ${after.apellidos} ha sido modificado`,
      },
      data: {
        playerId: context.params.playerId,
        type: 'update_player',
        changes: JSON.stringify({
          before: `${before.nombre} ${before.apellidos}`,
          after: `${after.nombre} ${after.apellidos}`
        })
      }
    };

    try {
      const response = await admin.messaging().sendToTopic('all', payload);
      console.log('Notificación onUpdate enviada correctamente:', response);
      return response;
    } catch (error) {
      console.error('Error enviando notificación onUpdate:', error);
      return null;
    }
  });

/**
 * Trigger: cuando se GUARDA un nuevo token en Firestore (desde la web)
 * Lo suscribe automáticamente al topic 'all' para que reciba notificaciones
 */
exports.onNewToken = functions.firestore
  .document('fcm_tokens/{tokenId}')
  .onCreate(async (snap, context) => {
    const token = context.params.tokenId;
    try {
      const response = await admin.messaging().subscribeToTopic(token, 'all');
      console.log('Token suscrito exitosamente al topic "all":', response);
      return response;
    } catch (error) {
      console.error('Error suscribiendo el token al topic:', error);
      return null;
    }
  });
