import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { player } = route.params;
  const [zoomVisible, setZoomVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera con imagen del jugador */}
      <View style={styles.headerCard}>
        {/* Imagen con click para zoom */}
        <TouchableOpacity
          onPress={() => setZoomVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Ampliar imagen del jugador"
        >
          {player.imagen ? (
            <Image source={{ uri: player.imagen }} style={styles.playerImage} />
          ) : (
            <View style={[styles.playerImage, styles.placeholderImg]}>
              <Text style={styles.placeholderText}>
                {(player.nombre || '?').charAt(0)}
              </Text>
            </View>
          )}
          <Text style={styles.zoomHint}>📷 Toca para ampliar</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.teamLabel}>{player.equipo}</Text>
          <Text style={styles.playerName}>
            {player.nombre} {player.apellidos}
          </Text>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{player.posicion}</Text>
          </View>
        </View>
      </View>

      {/* Grid de estadísticas - TODOS los datos de Firebase */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>EDAD</Text>
          <Text style={styles.statValue}>{player.edad || '--'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ALTURA</Text>
          <Text style={styles.statValue}>{player.altura || '--'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DORSAL</Text>
          <Text style={styles.statValue}>#{player.dorsal || '--'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>POSICIÓN</Text>
          <Text style={styles.statValue}>{player.posicion || '--'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>EQUIPO</Text>
          <Text style={styles.statValue}>{player.equipo || '--'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ESTADO</Text>
          <Text
            style={[
              styles.statValue,
              { color: player.estado === 'Disponible' ? '#22c55e' : '#ef4444' },
            ]}
          >
            {player.estado || '--'}
          </Text>
        </View>
      </View>

      {/* Perfil / Descripción */}
      <View style={styles.profileBox}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        <Text style={styles.profileText}>
          {player.perfil || 'Sin descripción disponible para este jugador.'}
        </Text>
      </View>

      {/* Botón para ir a multimedia */}
      <TouchableOpacity
        style={styles.mediaButton}
        onPress={() => navigation.navigate('Media', { player })}
        accessibilityRole="button"
        accessibilityLabel="Ver vídeo del jugador"
      >
        <Text style={styles.mediaButtonText}>▶️ VER VÍDEO DEL JUGADOR</Text>
      </TouchableOpacity>

      {/* Modal de zoom de imagen */}
      <Modal
        visible={zoomVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setZoomVisible(false)}
          accessibilityRole="button"
          accessibilityLabel="Cerrar imagen ampliada"
        >
          {player.imagen ? (
            <Image
              source={{ uri: player.imagen }}
              style={styles.zoomedImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.zoomedImage, styles.placeholderZoom]}>
              <Text style={{ color: '#FFF', fontSize: 80 }}>
                {(player.nombre || '?').charAt(0)}
              </Text>
            </View>
          )}
          <Text style={styles.closeHint}>Toca en cualquier lugar para cerrar</Text>
        </TouchableOpacity>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 15 },
  headerCard: {
    backgroundColor: '#0D1B3E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  playerImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FDB927',
  },
  placeholderImg: {
    backgroundColor: '#1a2d5a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#FDB927', fontSize: 50, fontWeight: 'bold' },
  zoomHint: {
    textAlign: 'center',
    color: '#FDB927',
    marginTop: 6,
    fontSize: 12,
  },
  headerInfo: { alignItems: 'center', marginTop: 12 },
  teamLabel: { color: '#AAA', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  playerName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  positionBadge: {
    backgroundColor: '#2F70F2',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 4,
  },
  positionText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 4 },
  profileBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  profileText: { fontSize: 14, lineHeight: 22, color: '#555' },
  mediaButton: {
    backgroundColor: '#0D1B3E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#FDB927',
  },
  mediaButtonText: { color: '#FDB927', fontWeight: 'bold', fontSize: 16 },
  // Modal zoom
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: { width: '92%', height: '75%' },
  placeholderZoom: { justifyContent: 'center', alignItems: 'center' },
  closeHint: { color: '#FFF', marginTop: 20, fontSize: 14, opacity: 0.7 },
});
