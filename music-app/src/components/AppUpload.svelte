<script lang="ts">
    import {auth, songsCollection, storage} from '@/lib/firebase'
    import {getDownloadURL, ref, uploadBytesResumable, type UploadTask} from 'firebase/storage'
    import {addDoc} from 'firebase/firestore'
    import {type Song, type SongWithID} from '@/models/song'
    import {onDestroy} from "svelte";

    type Upload = {
        task: UploadTask
        current_progress: number
        name: string
        variant: string
        icon: string
        text_class: string
    }

    export let addSong: (newSong: SongWithID) => void
    let is_dragover = false
    let uploads: Upload[] = []

    function handleFileDrop(event: DragEvent) {
        if (!event.dataTransfer) return
        const files = [...(event.dataTransfer?.files || [])]
        upload(files)
    }

    function handleFileInput(event: Event) {
        const input = event.target as HTMLInputElement
        const files = [...(input.files || [])]
        upload(files)
    }

    function upload(files: File[]) {
        console.log({files})
        const uploadSongs = []
        files.forEach((f) => {
            if (f.type !== 'audio/mpeg') {
                return
            }

            if (!navigator.onLine) {
                uploadSongs.push({
                    task: {},
                    current_progress: 100,
                    name: f.name,
                    variant: 'bg-red-400',
                    icon: 'fas fa-times',
                    text_class: 'text-red-400'
                } as Upload)
                return
            }

            const songRef = ref(storage, `songs/${f.name}`)
            const task = uploadBytesResumable(songRef, f)
            const itemIndex =
                uploadSongs.push({
                    task,
                    current_progress: 0,
                    name: f.name,
                    variant: 'bg-blue-400',
                    icon: 'fas fa-spinner fa-spin',
                    text_class: ''
                }) - 1

            uploads = [...uploads, ...uploadSongs]
            task.on(
                'state_changed',
                (snapshot) => {
                    uploads[itemIndex] = {
                        ...uploads[itemIndex],
                        current_progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    }
                },
                (error) => {
                    console.error(error)
                    uploads[itemIndex] = {
                        ...uploads[itemIndex],
                        variant: 'bg-red-400',
                        text_class: 'text-red-400',
                        icon: 'fas fa-times'
                    }
                },
                async () => {
                    if (!auth.currentUser) return

                    const url = await getDownloadURL(task.snapshot.ref)
                    const song: Song = {
                        uid: auth.currentUser.uid,
                        url,
                        display_name: auth.currentUser.displayName || '',
                        original_name: task.snapshot.ref.name,
                        modified_name: task.snapshot.ref.name,
                        genre: '',
                        comment_count: 0
                    }
                    const songRef = await addDoc(songsCollection, song)
                    addSong({...song, doc_id: songRef.id})

                    uploads[itemIndex].variant = 'bg-green-400'
                    uploads[itemIndex].text_class = 'text-green-400'
                    uploads[itemIndex].icon = 'fas fa-check'
                }
            )
        })
        is_dragover = false
    }

    function cancelUploads() {
        uploads.forEach((upload) => {
            upload.task.cancel()
        })
    }

    onDestroy(() => {
        cancelUploads()
    })

</script>

<div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
        <!-- Upload Dropbox -->
        <div
                class={`w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid ${is_dragover ? 'bg-green-400 border-green-400 border-solid' : ''}`}
                on:drag|preventDefault|stopPropagation
                on:dragstart|preventDefault|stopPropagation
                on:dragend|preventDefault|stopPropagation={() => is_dragover = false}
                on:dragover|preventDefault|stopPropagation={() => is_dragover = true}
                on:dragenter|preventDefault|stopPropagation={() => is_dragover = true}
                on:dragleave|preventDefault|stopPropagation={() => is_dragover = false}
                on:drop|preventDefault|stopPropagation={handleFileDrop}
        >
            <h5>Drop your files here</h5>
        </div>
        <input type="file" multiple on:change={handleFileInput}/>
        <hr class="my-6"/>
        <!-- Progess Bars -->
        {#each uploads as upload (upload.name)}
            <div class="mb-4">
                <!-- File Name -->
                <div class={`font-bold text-sm ${upload.text_class}`}>
                    <i class={upload.icon}></i>
                    {upload.name}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div
                            class={`transition-all progress-bar ${upload.variant}`}
                            style="width: {upload.current_progress}%;"
                    ></div>
                </div>
            </div>
        {/each}
    </div>
</div>

