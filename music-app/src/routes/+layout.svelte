<script>
	import '../app.css';
	import AuthModal from '@/components/AuthModal.svelte';
	import AppHeader from '@/components/AppHeader.svelte';

    import {initFirebase} from "$lib/firebase";
    import { onMount } from 'svelte';
	import { userStore } from '@/stores/userStore';
	import AppPlayer from '@/components/AppPlayer.svelte';

	onMount(() => {
        initFirebase();
		userStore.checkAuth();
	});
</script>

<AppHeader />
<slot />
<AuthModal />
<AppPlayer />
