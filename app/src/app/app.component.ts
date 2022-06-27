import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from './service/notification.service';
import { BehaviorSubject, map, Observable, of, startWith } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataState } from './enumeration/data-state.enum';
import { Status } from './enumeration/status.enum';
import { AppState } from './interface/app-state';
import { Response } from './interface/response';
import { Server } from './interface/server';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  /* Increase App Performance: Angular only rerender to Application if a Observable (or Input, Event) push Changes */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  /* Observables are denoted with a $ */
  appState$: Observable<AppState<Response>>;
  readonly DataState = DataState;
  readonly Status = Status;
  /* `BehaviorSubject` supports instead of `Subject` also Lazy Loading */
  private dataSubject = new BehaviorSubject<Response>(null);
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingSubject$ = this.isLoadingSubject.asObservable();

  constructor(
    private serverService: ServerService,
    private notificationService: NotificationService
  ) {}

  /* Lifecycle Hook is executed once the App is initialized */
  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response: Response) => {
        this.notificationService.onDefault(response.message);
        /* Copying Data for App Component */
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED_STATE,
          appData: response,
        };
      }),
      startWith({
        dataState: DataState.LOADING_STATE,
      }),
      catchError((error: string) => {
        this.notificationService.onError(error);
        /* `of` creates an Observable */
        return of({
          dataState: DataState.ERROR_STATE,
          error,
        });
      })
    );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((response: Response) => {
        this.dataSubject.value.data.servers[
          /* Finding Index of Server that is looking for */
          this.dataSubject.value.data.servers.findIndex((server) => {
            return server.id === response.data.server.id;
          })
        ] = response.data.server;
        this.notificationService.onDefault(response.message);
        /* After Processing reset Subject to stop showing the Spinner */
        this.filterSubject.next('');
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        /* Using copied Data from the Start respectively `ngOnInit` */
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notificationService.onError(error);
        /* After Processing reset Subject to stop showing the Spinner */
        this.filterSubject.next('');
        /* `of` creates an Observable */
        return of({
          dataState: DataState.ERROR_STATE,
          error,
        });
      })
    );
  }

  filterServers(status: Status): void {
    this.appState$ = this.serverService
      .filter$(status, this.dataSubject.value)
      .pipe(
        map((response: Response) => {
          this.notificationService.onDefault(response.message);
          return {
            dataState: DataState.LOADED_STATE,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          /* Using copied Data from the Start respectively `ngOnInit` */
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.notificationService.onError(error);
          /* After Processing reset Subject to stop showing the Spinner */
          this.filterSubject.next('');
          /* `of` creates an Observable */
          return of({
            dataState: DataState.ERROR_STATE,
            error,
          });
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    /* Setting Loading State */
    this.isLoadingSubject.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server).pipe(
      map((response: Response) => {
        /* Updating App Sate with new Server */
        this.dataSubject.next({
          ...response,
          data: {
            servers: [
              ...this.dataSubject.value.data.servers,
              response.data.server,
            ],
          },
        });
        this.notificationService.onDefault(response.message);
        /* Closing Modal */
        document.getElementById('closeModal').click();
        /* Resetting Loading and Form and setting Default Value for `status` */
        this.isLoadingSubject.next(false);
        serverForm.resetForm({
          status: this.Status.SERVER_DOWN,
        });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        /* Using copied Data from the Start respectively `ngOnInit` */
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notificationService.onError(error);
        /* Resetting Loading State */
        this.isLoadingSubject.next(false);
        /* `of` creates an Observable */
        return of({
          dataState: DataState.ERROR_STATE,
          error,
        });
      })
    );
  }

  deleteServer(id: number): void {
    /* Setting Loading State */
    this.isLoadingSubject.next(true);
    this.appState$ = this.serverService.delete$(id).pipe(
      map((response: Response) => {
        this.dataSubject.next({
          ...response,
          data: {
            servers: this.dataSubject.value.data.servers.filter((server) => {
              return server.id !== id;
            }),
          },
        });
        this.notificationService.onDefault(response.message);
        /* Resetting Loading State */
        this.isLoadingSubject.next(false);
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        /* Using copied Data from the Start respectively `ngOnInit` */
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notificationService.onError(error);
        /* After Processing reset Subject to stop showing the Spinner */
        this.filterSubject.next('');
        /* `of` creates an Observable */
        return of({
          dataState: DataState.ERROR_STATE,
          error,
        });
      })
    );
  }

  printServers(): void {
    /* Alternative: Print as PDF */
    // window.print();
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    /* Grabbing whole Table as HTML Element */
    let tableSelect = document.getElementById('servers');
    /* Replacing all Spaces with encoded Space `%20` */
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'servers.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
    this.notificationService.onDefault('Servers printed');
  }
}
