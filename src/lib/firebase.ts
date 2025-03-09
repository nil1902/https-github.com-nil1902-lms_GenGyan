import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYrcJmNxJCBdaFfEDYHvnmtDC5_7OGD-8",
  authDomain: "gyan-gen-lms.firebaseapp.com",
  projectId: "gyan-gen-lms",
  storageBucket: "gyan-gen-lms.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user };
  } catch (error) {
    console.error("Firebase sign in error:", error);
    throw error;
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // Update user profile with name
    await firebaseUpdateProfile(userCredential.user, {
      displayName: name,
    });
    return { user: userCredential.user };
  } catch (error) {
    console.error("Firebase sign up error:", error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Firebase reset password error:", error);
    throw error;
  }
}

export async function updatePassword(password: string) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is signed in");
    await firebaseUpdatePassword(user, password);
    return true;
  } catch (error) {
    console.error("Firebase update password error:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error("Firebase sign out error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  return new Promise<FirebaseUser | null>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export { auth };
