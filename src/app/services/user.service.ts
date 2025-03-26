import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { UserData } from '../models/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async createUserData(user: User): Promise<void> {
    // Create base user data
    const userData: Partial<UserData> = {
      uid: user.uid,
      email: user.email!,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // Only add optional fields if they exist
    if (user.displayName) {
      userData.displayName = user.displayName;
    }
    if (user.photoURL) {
      userData.photoURL = user.photoURL;
    }

    await setDoc(doc(this.firestore, 'users', user.uid), userData);
  }

  async updateLastLogin(userId: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await setDoc(userRef, {
      lastLogin: new Date()
    }, { merge: true });
  }

  async getUserData(userId: string): Promise<UserData | null> {
    const userDoc = await getDoc(doc(this.firestore, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  }

  async updateUserSettings(userId: string, settings: Partial<UserData>): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await setDoc(userRef, settings, { merge: true });
  }
} 