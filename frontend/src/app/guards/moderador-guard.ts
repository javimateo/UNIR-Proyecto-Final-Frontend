import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceServices } from '../service/auth-service.services';

export const moderadorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceServices)
  const router = inject(Router)
  if( authService.getRole() === 'moderator'){
    return true
  }else{
    router.navigate(['/home'])
    return false;
  }
};
