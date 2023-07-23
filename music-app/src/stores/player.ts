import type { SongWithID } from '@/models/song';

import { Howl } from 'howler';
import { formatTime } from '@/lib/helper';

import { writable, get } from 'svelte/store';

export const currentSong = writable<SongWithID>();
export const sound = writable<Howl>();
export const seek = writable('00:00');
export const duration = writable('00:00');
export const playerProgress = writable('0%');
export const playing = writable(false);

export const playerStore = createPlayerStore();

function createPlayerStore() {
	async function playSong(song: SongWithID) {
		const currentSound = get(sound);
		if (currentSound) {
			currentSound.unload();
		}

		currentSong.set(song);
		const newSound = new Howl({
			src: [song.url],
			html5: true
		});
		sound.set(newSound);

		newSound.play();
		playing.set(true);

		newSound.on('play', () => {
			requestAnimationFrame(progress);
		});
	}

	function progress() {
		const currentSound = get(sound);
		const soundSeek = currentSound?.seek() ?? 0;
		const soundDuration = currentSound?.duration() ?? 0;
		seek.set(formatTime(soundSeek));
		duration.set(formatTime(soundDuration));
		playerProgress.set(`${(soundSeek / soundDuration) * 100}%`);

		if (currentSound?.playing()) {
			requestAnimationFrame(progress);
		}
	}

	async function pauseSong() {
		const currentSound = get(sound);
		if (!currentSound) return;

		if (currentSound.playing()) {
			currentSound.pause();
			playing.set(false);
		}
	}

	async function toggleAudio() {
		const currentSound = get(sound);
		if (!currentSound) return;

		if (currentSound.playing()) {
			currentSound.pause();
			playing.set(false);
		} else {
			currentSound.play();
			playing.set(true);
		}
	}

	async function updateSeek(percentage: number) {
		const currentSound = get(sound);
		if (!currentSound) return;

		const seconds = currentSound?.duration() * percentage;
		currentSound.seek(seconds);
		currentSound.once('seek', progress);
	}

	return {
		playSong,
		pauseSong,
		toggleAudio,
		updateSeek
	};
}
