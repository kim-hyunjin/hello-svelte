<script>
    import '../app.css'
    import AuthModal from "@/components/AuthModal.svelte";
    import { onMount } from 'svelte';
    import {userStore} from "@/stores/userStore";

    onMount(() => {
        userStore.checkAuth()
    })
</script>

<slot />
<AuthModal />