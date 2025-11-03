import mongoose from 'mongoose'

let isConnected = false

mongoose.set('debug', true)

process.on('unhandledRejection', (reason, promise) => {

    console.error('Unhandled Rejection at:', promise, 'reason:', reason);

})

export async function initDB(uri: string) {

    console.log('🔌 Starting initDB function...');
    console.log('MongoDB URI:', uri);

    if (isConnected) {

        console.log('⚡ MongoDB is already connected.');
        return;

    }

    try {

        console.log('⏳ Attempting to connect to MongoDB...')

        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000, // 30s timeout
        })

        isConnected = connection.connections[0].readyState === 1;

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

        await mongoose.disconnect();
        isConnected = false;
        console.log('🔒 MongoDB connection closed.');

    } catch (error) {

        console.error('Error while closing MongoDB connection:', error);

    }
    
}

// Ferme proprement quand le process s'arrête
process.on('SIGINT', async () => {

    await closeDB();
    process.exit(0);

})

process.on('SIGTERM', async () => {

    await closeDB();
    process.exit(0);

})
