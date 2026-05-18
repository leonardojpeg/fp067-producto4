import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio, Video, ResizeMode } from 'expo-av';

export default function MediaScreen({ route }) {
  const { player } = route.params;
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Configurar audio para reproducción
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  const isPlaying = status.isPlaying || false;
  const positionMs = status.positionMillis || 0;
  const durationMs = status.durationMillis || 1;

  // Formatear tiempo mm:ss
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // ===== BOTÓN 1: Play / Pause =====
  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  // ===== BOTÓN 2: Stop (volver al inicio) =====
  const stop = async () => {
    if (!videoRef.current) return;
    await videoRef.current.stopAsync();
    await videoRef.current.setPositionAsync(0);
  };

  // ===== BOTÓN 3: Mute / Unmute =====
  const toggleMute = async () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    await videoRef.current.setIsMutedAsync(newMuted);
    setIsMuted(newMuted);
  };

  // ===== BOTÓN 4: Cambiar velocidad =====
  const changeSpeed = async () => {
    if (!videoRef.current) return;
    const speeds = [0.5, 1.0, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    await videoRef.current.setRateAsync(newSpeed, true);
    setPlaybackSpeed(newSpeed);
  };

  // ===== BOTÓN 5: Retroceder 10 segundos =====
  const rewind = async () => {
    if (!videoRef.current) return;
    const newPos = Math.max(0, positionMs - 10000);
    await videoRef.current.setPositionAsync(newPos);
  };

  // ===== BOTÓN 6: Adelantar 10 segundos =====
  const forward = async () => {
    if (!videoRef.current) return;
    const newPos = Math.min(durationMs, positionMs + 10000);
    await videoRef.current.setPositionAsync(newPos);
  };

  // Verificar si hay URL de video
  if (!player.video) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🎬</Text>
        <Text style={styles.errorText}>
          Este jugador no tiene vídeo disponible.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>
        {player.nombre} {player.apellidos}
      </Text>
      <Text style={styles.subtitle}>{player.equipo} • Highlights</Text>

      {/* Reproductor de vídeo - URL desde Firebase */}
      <View style={styles.videoWrapper}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#FDB927"
            style={styles.loader}
          />
        )}
        <Video
          ref={videoRef}
          source={{ uri: player.video }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          onPlaybackStatusUpdate={(s) => {
            setStatus(s);
            if (s.isLoaded) setIsLoading(false);
          }}
          onLoad={() => setIsLoading(false)}
        />
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(positionMs / durationMs) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
      </View>

      {/* Controles principales: mínimo 4 botones (tenemos 6) */}
      <View style={styles.controlsRow}>
        {/* Botón 5: Retroceder */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={rewind}
          accessibilityRole="button"
          accessibilityLabel="Retroceder 10 segundos"
        >
          <Text style={styles.controlIcon}>⏪</Text>
          <Text style={styles.controlLabel}>-10s</Text>
        </TouchableOpacity>

        {/* Botón 1: Play/Pause */}
        <TouchableOpacity
          style={[styles.controlBtn, styles.controlBtnPrimary]}
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          <Text style={styles.controlIconLarge}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
          <Text style={styles.controlLabel}>
            {isPlaying ? 'Pausa' : 'Play'}
          </Text>
        </TouchableOpacity>

        {/* Botón 6: Adelantar */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={forward}
          accessibilityRole="button"
          accessibilityLabel="Adelantar 10 segundos"
        >
          <Text style={styles.controlIcon}>⏩</Text>
          <Text style={styles.controlLabel}>+10s</Text>
        </TouchableOpacity>
      </View>

      {/* Controles secundarios */}
      <View style={styles.controlsRow}>
        {/* Botón 2: Stop */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={stop}
          accessibilityRole="button"
          accessibilityLabel="Detener reproducción"
        >
          <Text style={styles.controlIcon}>⏹️</Text>
          <Text style={styles.controlLabel}>Stop</Text>
        </TouchableOpacity>

        {/* Botón 3: Mute */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={toggleMute}
          accessibilityRole="button"
          accessibilityLabel={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🔊'}</Text>
          <Text style={styles.controlLabel}>
            {isMuted ? 'Muted' : 'Audio'}
          </Text>
        </TouchableOpacity>

        {/* Botón 4: Velocidad */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={changeSpeed}
          accessibilityRole="button"
          accessibilityLabel={`Velocidad actual ${playbackSpeed}x`}
        >
          <Text style={styles.controlIcon}>⚡</Text>
          <Text style={styles.controlLabel}>{playbackSpeed}x</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B3E',
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1B3E',
    padding: 20,
  },
  errorIcon: { fontSize: 60, marginBottom: 16 },
  errorText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FDB927',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loader: { position: 'absolute' },
  // Barra de progreso
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  timeText: { color: '#AAA', fontSize: 12, width: 42, textAlign: 'center' },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FDB927',
    borderRadius: 2,
  },
  // Controles
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2d5a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  controlBtnPrimary: {
    backgroundColor: '#FDB927',
    paddingHorizontal: 24,
  },
  controlIcon: { fontSize: 22 },
  controlIconLarge: { fontSize: 28 },
  controlLabel: { color: '#FFF', fontSize: 11, fontWeight: '600', marginTop: 4 },
});
