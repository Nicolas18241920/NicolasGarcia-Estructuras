import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return authState(inject(Auth)).pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login']))),
  );
};
