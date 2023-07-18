<script lang="ts">
    import AppUpload from '@/components/AppUpload.svelte'
    import {songsCollection, auth} from '@/lib/firebase'
    import type {Song, SongWithID} from '@/models/song'
    import {query, where, getDocs} from 'firebase/firestore'
    import CompositionItem from '@/components/CompositionItem.svelte'
    import {userStore} from "@/stores/userStore";

    let initiated = false
    let songs: SongWithID[] = []
    let unsavedFlag = false
    let userLoggedIn = false

    userStore.subscribe((state) => {
        userLoggedIn = state.userLoggedIn
    })

    $: if (userLoggedIn && !initiated) {
        fetchSongs()
        initiated = true
    }

    async function fetchSongs() {
        const q = query(songsCollection, where('uid', '==', auth.currentUser?.uid))
        const snapshot = await getDocs(q)

        const fetched = []
        snapshot.forEach((doc) => {
            const song: SongWithID = {
                ...(doc.data() as Song),
                doc_id: doc.id
            }
            fetched.push(song)
        })
        songs = [...songs, ...fetched]
    }

    function updateSong(updatedSong: SongWithID) {
        const index = songs.findIndex((e) => e.doc_id === updatedSong.doc_id)
        if (index === -1) return

        songs[index] = updatedSong
        songs = [...songs]
    }

    function removeSong(doc_id: string) {
        const index = songs.findIndex((e) => e.doc_id === doc_id)
        if (index === -1) return

        songs.splice(index, 1)
        songs = [...songs]
    }

    function addSong(newSong: SongWithID) {
        songs = [...songs, newSong]
    }

    function updateUnsavedFlag(flag: boolean) {
        unsavedFlag = flag
    }

    function beforeRouteLeave(to, from, next) {
        // ;(this.$refs.uploadRef as any).cancelUploads()
        // next()
        if (!unsavedFlag) {
            next()
        } else {
            const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
            next(leave)
        }
    }
</script>

<!-- Main Content -->
<section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
            <AppUpload ref="uploadRef" addSong={addSong}></AppUpload>
        </div>
        <div class="col-span-2">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                    <span class="card-title">My Songs</span>
                    <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                </div>
                <div class="p-6">
                    <!-- Composition Items -->
                    {#each songs as song (song.doc_id)}
                        <CompositionItem
                                song={song}
                                updateSong={updateSong}
                                removeSong={removeSong}
                                updateUnsavedFlag={updateUnsavedFlag}
                        />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>
