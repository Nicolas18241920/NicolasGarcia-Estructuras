import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario = signal<string | null>(null);

  constructor() {
    onAuthStateChanged(auth, (u) => this.usuario.set(u?.email ?? null));
  }

  estaLogueado(): boolean {
    return this.usuario() !== null;
  }

  obtenerUid(): string {
    return auth.currentUser?.uid ?? '';
  }

  async registrar(email: string, pass: string): Promise<void> {
    await createUserWithEmailAndPassword(auth, email, pass);
  }

  async entrar(email: string, pass: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, pass);
  }

  async salir(): Promise<void> {
    await signOut(auth);
  }
}