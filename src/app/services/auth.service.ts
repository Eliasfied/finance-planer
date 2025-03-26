import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { FirebaseErrorHandler } from '../utils/firebase-error-handler';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Stores the login status
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);
  // Makes the status available to other components
  isAuthenticated$ = this.isAuthenticated.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private auth: Auth,
    private userService: UserService
  ) {
    // Updates the status when login state changes
    this.auth.onAuthStateChanged(async user => {
      this.isAuthenticated.next(user !== null);
      this.currentUser.next(user);
      
      if (user) {
        // Update last login
        await this.userService.updateLastLogin(user.uid);
      }
    });
  }

  // Login user
  async login(email: string, password: string): Promise<void> {
    try {
      console.log('Attempting login with:', { email });
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful:', userCredential.user.uid);
      // Create or update user data
      await this.userService.createUserData(userCredential.user);
    } catch (error: any) {
      console.error('Login error:', error);
      throw FirebaseErrorHandler.handleAuthError(error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      // Create or update user data
      await this.userService.createUserData(userCredential.user);
    } catch (error: any) {
      console.error('Google login error:', error);
      throw FirebaseErrorHandler.handleAuthError(error);
    }
  }

  // Register new user
  async register(email: string, password: string): Promise<void> {
    try {
      console.log('Attempting registration with:', { email });
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registration successful:', userCredential.user.uid);
      // Create user data
      await this.userService.createUserData(userCredential.user);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw FirebaseErrorHandler.handleAuthError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw FirebaseErrorHandler.handleAuthError(error);
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }
}
