import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
} from '@angular/fire/auth';

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ese correo ya está registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  private readonly currentUser = toSignal(authState(this.auth));
  readonly email = computed(() => this.currentUser()?.email ?? null);
  readonly isLoggedIn = computed(() => !!this.currentUser());

  login(email: string, password: string): Promise<void> {
    return this.run(() => signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string): Promise<void> {
    return this.run(() => createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  private async run(action: () => Promise<unknown>): Promise<void> {
    try {
      await action();
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      throw new Error(MESSAGES[code] ?? 'No se pudo completar la autenticación.');
    }
  }
}
