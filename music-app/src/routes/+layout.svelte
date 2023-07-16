<script>
    import '../app.css'
    import AuthModal from "@/components/AuthModal.svelte";
    import AppHeader from "@/components/AppHeader.svelte";

    import { onMount } from 'svelte';
    import {userStore} from "@/stores/userStore";

    onMount(() => {
        userStore.checkAuth()
    })
</script>

<AppHeader />
<slot />
<AuthModal />