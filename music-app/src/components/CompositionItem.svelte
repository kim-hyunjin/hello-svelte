<script lang="ts">
    import {songsCollection, storage} from '@/lib/firebase'
    import type {SongWithID} from '@/models/song'
    import {doc, updateDoc, deleteDoc} from 'firebase/firestore'
    import {ref as storageRef, deleteObject} from 'firebase/storage'

    export let song: SongWithID
    export let updateSong: (updated: SongWithID) => void
    export let removeSong: (doc_id: string) => void
    export let updateUnsavedFlag: (flag: boolean) => void

    let modified_name = ''
    let genre = ''
    let showForm = false
    let inSubmission = false
    let showAlert = false
    let alertVariant = 'bg-blue-500'
    let alertMessage = 'Please wait! Updating song info...'

    async function edit() {
        inSubmission = true
        showAlert = true
        alertVariant = 'bg-blue-500'
        alertMessage = 'Please wait! Updating song info...'

        try {
            await updateDoc(doc(songsCollection, song.doc_id), {
                modified_name,
                genre
            })

            updateSong({...song, ...{
                    modified_name,
                    genre
                }})
            updateUnsavedFlag(false)

            inSubmission = false
            alertVariant = 'bg-green-500'
            alertMessage = 'Success!'
        } catch (error) {
            inSubmission = false
            alertVariant = 'bg-red-500'
            alertMessage = 'Something went wrong...'
        }
    }

    async function deleteSong() {
        await deleteObject(storageRef(storage, `songs/${song.original_name}`))
        await deleteDoc(doc(songsCollection, song.doc_id))
        removeSong(song.doc_id)
    }
</script>
<div class="border border-gray-200 p-3 mb-4 rounded">
    {#if !showForm}
        <div>
            <h4 class="inline-block text-2xl font-bold">{ song.modified_name }</h4>
            <button
                    class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                    on:click|preventDefault={deleteSong}
            >
                <i class="fa fa-times"></i>
            </button>
            <button
                    class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                    on:click|preventDefault={() => showForm = !showForm}
            >
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
    {:else}
        <div>
            {#if showAlert}
                <div class="text-white text-center font-bold p-4 mb-4 {alertVariant}">
                    { alertMessage }
                </div>
            {/if}
            <form on:submit={edit}>
                <div class="mb-3">
                    <label for="modified_name" class="inline-block mb-2">Song Title</label>
                    <input
                            bind:value={modified_name}
                            id="modified_name"
                            name="modified_name"
                            type="text"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                            placeholder="Enter Song Title"
                            on:input={() => updateUnsavedFlag(true)}
                    />
                </div>
                <div class="mb-3">
                    <label for="genre" class="inline-block mb-2">Genre</label>
                    <input
                            bind:value={genre}
                            id="genre"
                            name="genre"
                            type="text"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                            placeholder="Enter Genre"
                            on:input={() => updateUnsavedFlag(true)}
                    />
                </div>
                <button
                        type="submit"
                        class="py-1.5 px-3 rounded text-white bg-green-600"
                        disabled={inSubmission}
                >
                    Submit
                </button>
                <button
                        type="button"
                        class="py-1.5 px-3 rounded text-white bg-gray-600"
                        disabled={inSubmission}
                        on:click|preventDefault={() => showForm = false}
                >
                    Go Back
                </button>
            </form>
        </div>
    {/if}
</div>

