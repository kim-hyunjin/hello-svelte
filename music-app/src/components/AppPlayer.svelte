<script lang="ts">
	import {
		playerStore,
		playerProgress,
		playing,
		seek,
		duration,
		currentSong
	} from '@/stores/player';

	const { toggleAudio, updateSeek } = playerStore;

	function handleChangeSeek(event: MouseEvent) {
		const { x, width } = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const clientX = event.clientX - x;
		const percentage = clientX / width;
		updateSeek(percentage);
	}
</script>

<!-- Player -->
{#if $currentSong}
	<div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
		<!-- Track Info -->
		{#if $currentSong.modified_name}
			<div class="text-center">
				<span class="song-title font-bold">{$currentSong.modified_name}</span> by
				<span class="song-artist">{$currentSong.display_name}</span>
			</div>
		{/if}
		<div class="flex flex-nowrap gap-4 items-center">
			<!-- Play/Pause Button -->
			<button type="button" on:click|preventDefault={toggleAudio} id="player-play-btn">
				<i class={`fa text-gray-500 text-xl ${$playing ? 'fa-pause' : 'fa-play'}`} />
			</button>
			<!-- Current Position -->
			<div class="player-currenttime">{$seek}</div>
			<!-- Scrub Container  -->
			<button
				class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
				on:click|preventDefault={handleChangeSeek}
			>
				<!-- Player Ball -->
				<span
					class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
					style="left: {$playerProgress};"
				>
					<i class="fas fa-circle" />
				</span>
				<!-- Player Progress Bar-->
				<span
					class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
					style="width: {$playerProgress}"
				/>
			</button>
			<!-- Duration -->
			<div class="player-duration">{$duration}</div>
		</div>
	</div>
{/if}
