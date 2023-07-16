<script lang="ts">
    import {userStore} from "@/stores/userStore";

    let login_in_submission = false
    let login_show_alert = false
    let login_alert_variant = 'bg-blue-500'
    let login_alert_msg = 'Please wait! We are logging you in.'

    let email = ''
    let password = ''

    async function login() {
        login_show_alert = true
        login_in_submission = true
        login_alert_variant = 'bg-blue-500'
        login_alert_msg = 'Please wait! We are logging you in.'

        try {
            await userStore.authenticate({email, password})
        } catch (error) {
            login_in_submission = false
            login_alert_variant = 'bg-red-500'
            login_alert_msg = 'Invalid login details.'
            return
        }

        login_alert_variant = 'bg-green-500'
        login_alert_msg = 'Success! You are now logged in.'
        window.location.reload()
    }
</script>

<div>
    {#if login_show_alert}
        <div
                class={`text-white text-center font-bold p-4 rounded mb-4 ${login_alert_variant}`}
        >
            { login_alert_msg }
        </div>
    {/if}
    <!-- Login Form -->
    <form on:submit|preventDefault={login}>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Email
                <input
                        bind:value={email}
                        name="email"
                        type="email"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Email"
                        required
                />

            </label>
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Password
                <input
                        bind:value={password}
                        name="password"
                        type="password"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Password"
                        required
                        minlength="9"
                        maxlength="100"
                />
            </label>
        </div>
        <button
                type="submit"
                class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
                disabled={login_in_submission}
        >
            Submit
        </button>
    </form>
</div>



