const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * HTTP Function: suscribe un token FCM al topic 'all'
 * Llamada desde la app web Angular al obtener el token
 */
exports.subscribeToTopic = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: 'Token requerido' });
    return;
  }

  try {
    await admin.messaging().subscribeToTopic(token, 'all');
    console.log('Token suscrito al topic all:', token.substring(0, 20) + '...');
    res.status(200).json({ success: true, message: 'Suscrito al topic all' });
  } catch (error) {
    console.error('Error suscribiendo al topic:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Trigger: cuando se CREA un nuevo jugador en la Realtime Database
 * Envía notificación push a todos los dispositivos suscritos al topic 'all'
 * (Angular web + React Native móvil)
 */
exports.onNewPlayer = functions.database
  .ref('/players/{playerId}')
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
 * Trigger: cuando se ACTUALIZA un jugador en la Realtime Database
 * Envía notificación push informando del cambio
 */
exports.onUpdatePlayer = functions.database
  .ref('/players/{playerId}')
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
