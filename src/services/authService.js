import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Signs in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Registers a new user.
 * @param {string} email
 * @param {string} password
 * @param {object} additionalData
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
export const registerUser = async (email, password, additionalData) => {
  try {
    // Create auth user
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Store extra user profile data in firestore
    await firestore().collection('users').doc(uid).set({
      ...additionalData,
      email: email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Signs out the current user.
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};