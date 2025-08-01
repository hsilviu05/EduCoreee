import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Notification, NotificationCount } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = 'http://localhost:5166/api';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private notificationCountSubject = new BehaviorSubject<NotificationCount>({ total: 0, unread: 0 });

  public notifications$ = this.notificationsSubject.asObservable();
  public notificationCount$ = this.notificationCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startPolling();
  }

  get notifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  get notificationCount(): NotificationCount {
    return this.notificationCountSubject.value;
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/notifications`)
      .pipe(
        tap(notifications => {
          this.notificationsSubject.next(notifications);
          this.updateNotificationCount();
        })
      );
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/notifications/${notificationId}/read`, {})
      .pipe(
        tap(() => {
          const notifications = this.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          );
          this.notificationsSubject.next(notifications);
          this.updateNotificationCount();
        })
      );
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/notifications/mark-all-read`, {})
      .pipe(
        tap(() => {
          const notifications = this.notifications.map(notification => ({
            ...notification,
            isRead: true,
            readAt: new Date()
          }));
          this.notificationsSubject.next(notifications);
          this.updateNotificationCount();
        })
      );
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/notifications/${notificationId}`)
      .pipe(
        tap(() => {
          const notifications = this.notifications.filter(
            notification => notification.id !== notificationId
          );
          this.notificationsSubject.next(notifications);
          this.updateNotificationCount();
        })
      );
  }

  private startPolling(): void {
    // Poll for new notifications every 30 seconds
    interval(30000).pipe(
      switchMap(() => this.getNotifications())
    ).subscribe();
  }

  private updateNotificationCount(): void {
    const notifications = this.notifications;
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    
    this.notificationCountSubject.next({ total, unread });
  }

  // Simulate real-time notification (for demo purposes)
  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentNotifications = this.notifications;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
    this.updateNotificationCount();
  }
} 