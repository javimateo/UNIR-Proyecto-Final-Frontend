import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceServices } from '../service/auth-service.services';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject (AuthServiceServices);
    const router = inject (Router)

    if(authService.getRole() === 'admin'){
      return true
    }else{
      router.navigate(['/home'])
      return false
    }
  }

