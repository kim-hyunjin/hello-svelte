<script lang="ts">
    import {
        getDocs,
        query,
        limit,
        startAfter,
        QueryDocumentSnapshot,
        orderBy,
        QueryConstraint
    } from 'firebase/firestore'
    import {songsCollection} from "$lib/firebase";
    import type {Song, SongWithID} from "@/models/song";
    import SongItem from "@/components/SongItem.svelte";

    let songs: SongWithID[] = []
    let maxPerPage = 3
    let lastDoc: QueryDocumentSnapshot | undefined | null = null
    let pendingRequest = false

    getSongs()

    async function getSongs() {
        if (pendingRequest) return
        if (lastDoc === undefined) return

        pendingRequest = true
        const queryFilters: QueryConstraint[] = [orderBy('modified_name'), limit(maxPerPage)]
        if (lastDoc) {
            queryFilters.push(startAfter(lastDoc))
        }

        const q = query(songsCollection, ...queryFilters)
        const snapshots = await getDocs(q)

        lastDoc = snapshots.docs[snapshots.docs.length - 1]

        const newSongs: SongWithID[] = []
        snapshots.forEach((doc) => {
            newSongs.push({
                doc_id: doc.id,
                ...(doc.data()) as Song
            })
        })
        songs = [...songs, ...newSongs]

        pendingRequest = false
    }

    function handleScroll() {
        const {scrollTop, offsetHeight} = document.documentElement
        const {innerHeight} = window
        const bottomOfWindow = Math.round(scrollTop) + innerHeight > offsetHeight - 100

        if (bottomOfWindow) {
            getSongs()
        }
    }

</script>

<svelte:window on:scroll={handleScroll}/>

<main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
        <div
                class="absolute inset-0 w-full h-full bg-contain introduction-bg"
                style="background-image: url(/img/header.png)"
        ></div>
        <div class="container mx-auto">
            <div class="text-white main-header-content">
                <h1 class="font-bold text-5xl mb-5">Listen to Music!</h1>
                <p class="w-full md:w-8/12 mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
                    congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
                    venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
                </p>
            </div>
        </div>

        <img
                class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
                src="/img/introduction-music.png"
                alt="Introduction"
        />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div
                    class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
            >
                <span class="card-title">Songs</span>
                <i class="fa fa-headphones-alt text-green-400 text-xl float-right"></i>
            </div>
            <!-- Playlist -->
            <ol id="playlist">
                {#each songs as song (song.doc_id)}
                    <SongItem bind:song={song}/>
                {/each}
            </ol>
            <!-- .. end Playlist -->
        </div>
    </section>
</main>

