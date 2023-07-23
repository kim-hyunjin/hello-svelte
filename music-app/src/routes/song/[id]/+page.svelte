<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { songsCollection, auth, commentsCollection } from '$lib/firebase';
	import type { Song, SongWithID } from '@/models/song';
	import { doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
	import { userStore } from '@/stores/userStore';
	import type { Comment, CommentWithID } from '@/models/comments';
	import { playerStore, playing, currentSong } from '@/stores/player';

	const songId = $page.params.id;

	let song: SongWithID;

	getSongData();
	getComments();

	async function getSongData() {
		const songRef = doc(songsCollection, songId);
		const snapshot = await getDoc(songRef);
		if (!snapshot.exists()) {
			goto('/');
		}

		song = {
			...(snapshot.data() as Song),
			doc_id: songId
		};
	}

	let userLoggedIn = $userStore.userLoggedIn;

	/**
	 * Comment
	 */
	let comments: CommentWithID[] = [];

	// comment sort
	let sort: 'latest' | 'oldest' = 'latest';
	let sortInUrl = $page.url.searchParams.get('sort');
	sort = sortInUrl === 'latest' || sortInUrl === 'oldest' ? sortInUrl : 'latest';
	$: {
		console.log({ sort });
		$page.url.searchParams.set('sort', sort);
		goto(`?${$page.url.searchParams.toString()}`);
	}

	$: sortedComments = comments.slice().sort((a, b) => {
		if (sort === 'latest') {
			return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
		} else {
			return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
		}
	});

	// comment submit status
	let commentInSubmission = false;
	let commentShowAlert = false;
	let commentAlertVariant = 'bg-blue-500';
	let commentAlertMsg = 'Please wait! Your comment is being submitted';

	async function addComment(values: { comment: string }, { resetForm }: { resetForm: () => void }) {
		commentInSubmission = true;
		commentShowAlert = true;
		commentAlertVariant = 'bg-blue-500';
		commentAlertMsg = 'Please wait! Your comment is being submitted';

		const comment: Comment = {
			content: values.comment,
			datePosted: new Date().toString(),
			sid: songId,
			name: auth.currentUser?.displayName ?? '',
			uid: auth.currentUser?.uid ?? ''
		};

		await setDoc(doc(commentsCollection), comment);

		if (song) {
			song.comment_count += 1;
			await updateDoc(doc(songsCollection, songId), { comment_count: song.comment_count });
		}

		getComments();

		commentInSubmission = false;
		commentAlertVariant = 'bg-green-500';
		commentAlertMsg = 'Comment added!';

		resetForm();
	}

	async function getComments() {
		const q = query(commentsCollection, where('sid', '==', songId));
		const commentSnapshots = await getDocs(q);

		const temp: CommentWithID[] = [];
		commentSnapshots.forEach((doc) => {
			temp.push({
				...(doc.data() as Comment),
				doc_id: doc.id
			});
		});

		comments = temp;
	}

	/**
	 * Play
	 */
	const { playSong, pauseSong, toggleAudio } = playerStore;

	function handlePlayAndPause() {
		if ($playing) {
			pauseSong();
			return;
		}
		if ($currentSong?.doc_id === song?.doc_id) {
			toggleAudio();
			return;
		}

		if (song) {
			playSong(song);
		}
	}
</script>

<main>
	<!-- Music Header -->
	<section class="w-full mb-8 py-14 text-center text-white relative">
		<div
			class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
			style="background-image: url(/img/song-header.png)"
		/>
		<div class="container mx-auto flex items-center">
			<!-- Play/Pause Button -->
			<button
				id="play-btn"
				on:click|preventDefault={handlePlayAndPause}
				type="button"
				class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
			>
				<i class={`fas ${$playing ? 'fa-pause' : 'fa-play'}`} />
			</button>
			<div class="z-50 text-left ml-8">
				<!-- Song Info -->
				<div class="text-3xl font-bold">{song?.modified_name}</div>
				<div>{song?.genre}</div>
			</div>
		</div>
	</section>
	<!-- Form -->
	<section class="container mx-auto mt-6" id="comments">
		<div class="bg-white rounded border border-gray-200 relative flex flex-col">
			<div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
				<!-- Comment Count -->
				<span class="card-title">Comments ({song?.comment_count})</span>
				<i class="fa fa-comments float-right text-green-400 text-2xl" />
			</div>
			<div class="p-6">
				{#if commentShowAlert}
					<div class={`text-white text-center font-bold p-4 mb-4 ${commentAlertVariant}`}>
						{commentAlertMsg}
					</div>
				{/if}

				{#if userLoggedIn}
					<vee-form on:submit={addComment} v-if="userLoggedIn">
						<vee-field
							as="textarea"
							name="comment"
							class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
							placeholder="Your comment here..."
						/>
						<button
							type="submit"
							class="py-1.5 px-3 rounded text-white bg-green-600 block"
							disabled={commentInSubmission}
						>
							Submit
						</button>
					</vee-form>
				{/if}
				<!-- Sort Comments -->
				<select
					bind:value={sort}
					class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
				>
					<option value="latest">Latest</option>
					<option value="oldest">Oldest</option>
				</select>
			</div>
		</div>
	</section>
	<!-- Comments -->
	<ul class="container mx-auto">
		{#each sortedComments as comment (comment.doc_id)}
			<li class="p-6 bg-gray-50 border border-gray-200">
				<!-- Comment Author -->
				<div class="mb-5">
					<div class="font-bold">{comment.name}</div>
					<time>{comment.datePosted}</time>
				</div>

				<p>
					{comment.content}
				</p>
			</li>
		{/each}
	</ul>
</main>
