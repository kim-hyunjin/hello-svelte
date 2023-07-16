
<script lang="ts">
    import {userStore} from "@/stores/userStore";

    let reg_in_submission = false
    let reg_show_alert = false
    let reg_alert_variant = 'bg-blue-500'
    let reg_alert_msg = 'Please wait! Your account is being created.'

    let user = {
        name: '',
        email: '',
        age: 0,
        password: '',
        confirmPassword: '',
        country: '',
        tos: false
    }

    async function register() {
        reg_in_submission = true
        reg_show_alert = true
        reg_alert_variant = 'bg-blue-500'
        reg_alert_msg = 'Please wait! Your account is being created.'

        try {
            await userStore.register(user)
        } catch (error) {
            reg_in_submission = false
            reg_alert_variant = 'bg-red-500'
            reg_alert_msg = 'An unexpected error occurred. Please try again later.'
            return
        }

        reg_alert_variant = 'bg-green-500'
        reg_alert_msg = 'Success! Your account has been created.'
        window.location.reload()
    }
</script>
<div>
    {#if reg_show_alert}
    <div
            class={`text-white text-center font-bold p-4 rounded mb-4 ${reg_alert_variant}`}
    >
        { reg_alert_msg }
    </div>
        {/if}
    <!-- Registration Form -->
    <form on:submit|preventDefault={register}>
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Name
            <input
                    bind:value={user.name}
                    name="name"
                    type="text"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Enter Name"
                    required
                    minlength="3"
                    maxlength="100"
            />
            </label>
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Email
            <input
                    bind:value={user.email}
                    type="email"
                    name="email"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Enter Email"
                    required
            />
            </label>
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Age
            <input
                    bind:value={user.age}
                    type="number"
                    name="age"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    required
                    min="18"
                    max="100"
            />
            </label>
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Password
                <input
                        bind:value={user.password}
                        type="password"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Password"
                        required
                        minlength="9"
                        maxlength="100"
                />
            </label>

        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Confirm Password
            <input
                    bind:value={user.confirmPassword}
                    type="password"
                    name="confirmPassword"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Confirm Password"
                    required
                    minlength="9"
                    maxlength="100"
            />
            </label>
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block w-full mb-2">Country
            <select
                    bind:value={user.country}
                    name="country"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    required
            >
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
                <option value="Antarctica">Antarctica</option>
            </select>
            </label>
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <div>
                <label class="inline-block w-full">
                <input
                        bind:checked={user.tos}
                        name="tos"
                        value="1"
                        type="checkbox"
                        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
                        required
                />
                Accept terms of service</label>
            </div>
        </div>
        <button
                type="submit"
                class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
                disabled={reg_in_submission}
        >
            Submit
        </button>
    </form>
</div>


