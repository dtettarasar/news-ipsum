import mongoose from 'mongoose'

// Éviter de logger toutes les requêtes MongoDB en production (fuite d'infos)
mongoose.set('debug', process.env.NODE_ENV === 'development')

process.on('unhandledRejection', (reason) => {
    const msg = reason instanceof Error ? reason.message : 'Unhandled Rejection'
    console.error('[DB] Unhandled Rejection:', msg)
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
        const msg = error instanceof Error ? error.message : 'Unknown error'
        console.error('[DB] Connection failed:', msg)
        throw error
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
        const msg = error instanceof Error ? error.message : 'Unknown error'
        console.error('[DB] Error while closing connection:', msg)
    }
}

// Gestion des signaux système
const handleShutdown = async () => {
    await closeDB();
    process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);