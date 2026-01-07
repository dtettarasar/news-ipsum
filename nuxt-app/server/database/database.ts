import mongoose from 'mongoose'

mongoose.set('debug', true)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
})

export async function initDB(uri: string) {
    console.log('🔌 Starting initDB function...');
    
    // États de readyState : 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const state = mongoose.connection.readyState;

    if (state === 1) {
        console.log('⚡ MongoDB is already connected.');
        return mongoose.connection;
    }

    if (state === 2) {
        console.log('⏳ MongoDB is currently connecting...');
        return; // Ou attendre la connexion existante
    }

    try {
        console.log('⏳ Attempting to connect to MongoDB...')
        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        })

        console.log('✅ Connected to MongoDB successfully.');
        return connection;

    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        console.trace();
        throw error;
    }
}

export async function closeDB() {
    try {
        // On ne déconnecte que si on n'est pas déjà déconnecté
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('🔒 MongoDB connection closed.');
        }
    } catch (error) {
        console.error('Error while closing MongoDB connection:', error);
    }
}

// Gestion des signaux système
const handleShutdown = async () => {
    await closeDB();
    process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);