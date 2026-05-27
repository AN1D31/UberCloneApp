// src/services/FirebaseConfig.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// En Android, con el archivo google-services.json, 
// no necesitas inicializar manualmente con un objeto de configuración (API Keys),
// el SDK lo hace automáticamente al compilar.

export { auth, firestore };