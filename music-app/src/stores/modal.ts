import {writable} from "svelte/store";

function createModalStore() {
    const {subscribe, update} = writable({
        isOpen: false,
    })

    function toggle() {
        update((state) => ({
            isOpen: !state.isOpen
        }))
    }

    return {
        subscribe, toggle
    }
}

export const modalStore = createModalStore()