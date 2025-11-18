import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSch = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    
    // Rôles ajustés
    role: {
        type: String,
        // La liste des rôles est étendue pour inclure les utilisateurs standards
        enum: ['superuser', 'admin', 'editor', 'reader'], 
        // Le rôle par défaut pour toute nouvelle inscription est maintenant 'reader'
        default: 'reader' 
    }
}, { timestamps: true });


// Hook 'pre-save' pour le hachage des mots de passe (inchangé)
// Version plus lisible avec async/await (recommandée)
UserSch.pre("save", async function (next) {

    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    
    try {

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();

    } catch (err) {

        // Gère les erreurs de hachage de manière centralisée
        next(err);
        
    }

});

export default mongoose.models.User || mongoose.model("User", UserSch);