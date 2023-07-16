<script lang="ts">
    import {userStore} from "@/stores/userStore";
    import {modalStore} from "@/stores/modal";


</script>
<header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
        <!-- App Name -->
        <a class="text-white font-bold uppercase text-2xl mr-4" href="/">Music</a>

        <div class="flex flex-grow items-center">
            <!-- Primary Navigation -->
            <ul class="flex flex-row mt-1">
                <!-- Navigation Links -->
                <li>
                    <a class="px-2 text-white" href="/about">About</a>
                </li>
                {#if $userStore.userLoggedIn}
                    <li>
                        <a class="px-2 text-white" href="/manage">Manage</a>
                    </li>
                    <li>
                        <button class="px-2 text-white" on:click|preventDefault={userStore.signOut}>Logout</button>
                    </li>
                {:else}
                    <li>
                        <button class="px-2 text-white" on:click|preventDefault={modalStore.toggle}>Login / Register
                        </button>
                    </li>
                {/if}
            </ul>
        </div>
    </nav>
</header>