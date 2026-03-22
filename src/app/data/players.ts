import { Player } from '../models/player';

export const PLAYERS: Player[] = [
  {
    id: 1,
    nombre: 'LeBron',
    apellidos: 'James',
    posicion: 'Alero',
    edad: 40,
    altura: '2.06 m',
    dorsal: 23,
    equipo: 'Los Angeles Lakers',
    estado: 'Disponible',
    perfil: 'Líder del equipo con amplia experiencia y capacidad anotadora.',
    video: 'assets/videos/lebron.mp4',
    imagen: 'assets/images/lebron.jpg'
  },
  {
    id: 2,
    nombre: 'Anthony',
    apellidos: 'Davis',
    posicion: 'Pívot',
    edad: 32,
    altura: '2.08 m',
    dorsal: 3,
    equipo: 'Los Angeles Lakers',
    estado: 'Disponible',
    perfil: 'Dominante en defensa y en la pintura.',
    video: 'assets/videos/jokic.mp4',
    imagen: 'assets/images/jokic.jpg'
  },
  {
    id: 3,
    nombre: 'D\'Angelo',
    apellidos: 'Russell',
    posicion: 'Base',
    edad: 29,
    altura: '1.93 m',
    dorsal: 1,
    equipo: 'Los Angeles Lakers',
    estado: 'Disponible',
    perfil: 'Base creativo con buen tiro exterior.',
    video: 'assets/videos/curry.mp4',
    imagen: 'assets/images/curry.jpg'
  },
  {
    id: 4,
    nombre: 'Austin',
    apellidos: 'Reaves',
    posicion: 'Escolta',
    edad: 27,
    altura: '1.96 m',
    dorsal: 15,
    equipo: 'Los Angeles Lakers',
    estado: 'Disponible',
    perfil: 'Jugador inteligente y versátil.',
    video: 'assets/videos/curry.mp4',
    imagen: 'assets/images/curry.jpg'
  },
  {
    id: 5,
    nombre: 'Rui',
    apellidos: 'Hachimura',
    posicion: 'Alero',
    edad: 28,
    altura: '2.03 m',
    dorsal: 28,
    equipo: 'Chicago Bulls',
    estado: 'Disponible',
    perfil: 'Jugador físico con capacidad ofensiva.',
    video: 'assets/videos/durant.mp4',
    imagen: 'assets/images/durant.jpg'
  }
];