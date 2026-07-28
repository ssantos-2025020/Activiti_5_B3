import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "kinal_token";

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, {
        correo,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.data?.token) {
            localStorage.setItem(this.TOKEN_KEY, res.data.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }
}
