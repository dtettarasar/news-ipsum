<template>

    <!-- Login form component for the admin panel -->
    <!-- Source https://prebuiltui.com -->

    <div class="flex items-center justify-center w-full px-4">

        <form @submit.prevent="handleLogin" class="flex w-full flex-col max-w-96">

            <a href="https://prebuiltui.com" class="mb-8" title="Go to PrebuiltUI">
                <svg class="size-10" width="30" height="33" viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585"
                        stroke="#1d293d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </a>

            <h2 class="text-4xl font-medium text-gray-900">Sign in</h2>

            <p class="mt-4 text-base text-gray-500/90">
                Please enter email and password to access.
            </p>

            <div class="mt-10">
                <label class="font-medium">Email</label>
                <input
                    placeholder="Please enter your email"
                    class="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
                    required
                    v-model="credentials.email"
                    type="email"
                    name="email"
                />
            </div>

            <div class="mt-6">
                <label class="font-medium">Password</label>
                <input
                    placeholder="Please enter your password"
                    class="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
                    required
                    v-model="credentials.password"
                    type="password"
                    name="password"
                />
            </div>

            <button
                type="submit"
                class="mt-8 py-3 w-full cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700"
            >
                Login
            </button>

        </form>

    </div>

</template>

<script setup lang="ts">

    const credentials = reactive({
        email: '',
        password: ''
    })

    const handleLogin = (event: Event) => {
        console.log('Login form submitted');
        console.log('Email:', credentials.email);
        console.log('Password:', credentials.password);
        // Here you can add your authentication logic
    }

</script>