import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const transformedResponse = new HttpResponse({
        status: error.status,
        body: { data: error.error?.reason || error.error || 'Erreur inconnue' }
      });
      return of(transformedResponse);
    })
  );
};
