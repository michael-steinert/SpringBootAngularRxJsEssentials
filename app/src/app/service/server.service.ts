import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Status } from '../enumeration/status.enum';
import { Response } from '../interface/response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) {}

  /* Procedural Approach */
  getServers(): Observable<Response> {
    return this.httpClient.get<Response>(`http::localhost:8080/sever/list`);
  }

  /* Reactive Approach */
  /* Observables are denoted with a $ */
  servers$ = <Observable<Response>>(
    this.httpClient
      .get<Response>(`${this.apiUrl}/server/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  save$ = (server: Server) => {
    return <Observable<Response>>(
      this.httpClient
        .post<Response>(`${this.apiUrl}/server/save`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  };

  ping$ = (ipAddress: string) => {
    return <Observable<Response>>(
      this.httpClient
        .get<Response>(`${this.apiUrl}/server/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  };

  delete$ = (id: number) => {
    return <Observable<Response>>(
      this.httpClient
        .get<Response>(`${this.apiUrl}/server/delete/${id}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  };

  filter$ = (status: Status, response: Response) => {
    return new Observable<Response>((subscriber) => {
      console.log(response);
      subscriber.next(
        status === Status.ALL
          ? {
              ...response,
              message: `Servers filtered by ${status} Status`,
            }
          : {
              ...response,
              message:
                response.data.servers.filter((server) => {
                  return server.status === status;
                }).length > 0
                  ? `Servers filtered by ${
                      status === Status.SERVER_UP ? 'SERVER UP' : 'SEVER DOWN'
                    } Status`
                  : `No Severs of ${status} found`,
              data: {
                servers: response.data.servers.filter((server) => {
                  return server.status === status;
                }),
              },
            }
      );
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));
  };

  private handleError(httpErrorResponse: HttpErrorResponse): Observable<never> {
    console.error(httpErrorResponse);
    return throwError(
      `An Error occurred - Error Code ${httpErrorResponse.status}`
    );
  }
}
