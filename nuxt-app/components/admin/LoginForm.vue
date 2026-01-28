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

    const handleLogin = async (event: Event) => {
        console.log('Login form submitted');
        console.log('Email:', credentials.email);
        console.log('Password:', credentials.password);
        // Here you can add your authentication logic

        try {
            
            // L'appel au backend
            // Nuxt devine automatiquement que c'est une requête vers ton serveur Nitro
            const response = await $fetch('/api/auth/admin-login', {
                method: 'POST',
                body: credentials
            })

            // C'est ici que l'on logue le retour du backend
            console.log('Réponse du serveur :', response);
        
            // On s'assure que le cookie a bien été traité par le navigateur 
            // avant de changer de page
            await navigateTo('/admin', { replace: true })

        } catch (err: any) {
            // En cas d'erreur (ex: serveur éteint ou erreur 500)
            console.error('Erreur lors de l\'appel API :', err);
        }

    }

</script>