import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../interfaces/auth/login.interface';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(private http: HttpClient) {
  }

  resetPass(data){
    return this.http.post<any>(`${environment.apiUrl}/users/change_passwd/`, data)
  }

  login(data: Login){
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, data).pipe(
      catchError((errorResp) => this.handleError(errorResp)),
      tap((res: User) =>{        
        //localStorage.setItem('user', JSON.stringify(res));
        this.handleUserSubject(res);				
      })
    );
  }

  private handleUserSubject(data:User)
  {    
		const user = new User(
			data.id,
			data.username,
			data.first_name,
			data.last_name,
			data.groups,
			data.access,
      data.refresh
		);

    localStorage.setItem('token', data.access);
		delete data.access;
    localStorage.setItem('refresh', data.refresh);
    delete data.refresh;
      
  }

  public getUserId(id){
    return this.http.get(`${environment.apiUrl}/users/${id}/`).pipe(
      catchError((errorResp) => this.handleError(errorResp)),
      tap((res: any) =>{        
        localStorage.setItem('user', JSON.stringify(res));
      })
    );  
  }

  private handleError(errorResp: HttpErrorResponse)
  {
    if (errorResp.error) {
			if (errorResp.error.messages) {
				if (Array.isArray(errorResp.error.messages)) {
					const msg = errorResp.error.messages;
					let errM = ''
					msg.forEach(element => {
						errM = errM + element.property + ': ' + element.errors[0] + '\n'
					});
					return throwError(errM);
				}
				else
					return throwError(errorResp.error.messages.toString())
			}
			if (errorResp.error.error) {
				return throwError(errorResp.error.error.toString())
			}
		}
		let errorMessage = 'Error de conexión';
		if (!errorResp.error || !errorResp.error.non_field_errors) {
			return throwError(errorMessage);
		}
    //delete localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');

		errorMessage = '';
		for (const key in errorResp.error) {
			if (errorResp.error.hasOwnProperty(key)) {
				errorMessage += errorResp.error[key] + '\n';
			}
		}
		return throwError(errorMessage);
  }

  public logout(){
    localStorage.clear()
  }
}



/* login(username: string, password: string) {
  return this.http
    .post<any>(`${environment.apiUrl}/authenticate`, {
      username,
      password,
    })
    .pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // console.log(JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
} */

/* logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
  return of({ success: false });
} */

