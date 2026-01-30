<template>

    <!-- Login form component for the admin panel -->
    <!-- Source https://prebuiltui.com -->

    <div class="flex items-center justify-center w-full px-4">

        <form @submit.prevent="handleLogin" class="flex w-full flex-col max-w-96">

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

            <p v-if="errorMessage" class="mt-4 text-sm text-red-600" role="alert">
                {{ errorMessage }}
            </p>

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

    const errorMessage = ref('')

    const handleLogin = async () => {
        errorMessage.value = ''
        try {
            await $fetch('/api/auth/admin-login', {
                method: 'POST',
                body: credentials
            })
            await navigateTo('/admin', { replace: true })
        } catch {
            errorMessage.value = 'Identifiants incorrects ou accès non autorisé.'
        }
    }

</script>