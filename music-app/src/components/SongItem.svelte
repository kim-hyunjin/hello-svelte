<script lang="ts">
    import type {SongWithID} from "@/models/song";

    export let song: SongWithID
</script>

<li
        class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
        id={song.doc_id}
>
    <div>
        <a
                href={`/song/${song.doc_id}`}
                class="font-bold block text-gray-600 song-link"
        >
            { song.modified_name }
        </a>
        <span class="text-gray-500 text-sm">{ song.display_name }</span>
    </div>

    <div class="text-gray-600 text-lg">
        <a
                href={`/song/${song.doc_id}#comments` }
        >
        <span class="comments">
          <i class="fa fa-comments text-gray-600"></i>
            { song.comment_count }
        </span>
        </a>
    </div>
</li>