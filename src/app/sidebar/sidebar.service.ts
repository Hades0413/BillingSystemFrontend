import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isSidebarClosed = new BehaviorSubject<boolean>(false);
  isSidebarClosed$ = this._isSidebarClosed.asObservable();

  get isSidebarClosed(): boolean {
    return this._isSidebarClosed.value;
  }

  toggleSidebar() {
    this._isSidebarClosed.next(!this._isSidebarClosed.value);
  }
}
