import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { ThemeService } from '../core/services/theme.service';
import { User, UserRole } from '../core/models/user.model';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="layout-container" [class.sidebar-collapsed]="isSidebarCollapsed">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="isSidebarCollapsed">
        <div class="sidebar-header">
          <h2 class="sidebar-title">EduCore</h2>
          <button class="close-btn" (click)="toggleSidebar()" aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/courses" routerLinkActive="active" class="nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <span>Courses</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/my-courses" routerLinkActive="active" class="nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-2.4-.4-3.5-1.5-2.5-2.4-6.5-2.4-9 0C7.4 11.6 6 12 5 12"/>
                  <path d="M3 3v18h18"/>
                </svg>
                <span>My Courses</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/quiz" routerLinkActive="active" class="nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-2.4-.4-3.5-1.5-2.5-2.4-6.5-2.4-9 0C7.4 11.6 6 12 5 12"/>
                  <path d="M3 3v18h18"/>
                </svg>
                <span>Quizzes</span>
              </a>
            </li>
            <li class="nav-item" *ngIf="isAdmin">
              <a routerLink="/admin" routerLinkActive="active" class="nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Admin</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content" (click)="closeSidebarOnMobile()">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <button class="menu-btn" (click)="toggleSidebar()" aria-label="Toggle menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>

          <div class="header-right">
            <!-- Theme Toggle -->
            <button class="theme-btn" (click)="toggleTheme()" aria-label="Toggle theme">
              <svg *ngIf="!isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg *ngIf="isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>

            <!-- Notifications -->
            <div class="notification-container">
              <button class="notification-btn" (click)="toggleNotifications()" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
                <span class="notification-badge" *ngIf="notificationCount.unread > 0">
                  {{ notificationCount.unread }}
                </span>
              </button>
              
              <div class="notification-dropdown" *ngIf="showNotifications">
                <div class="notification-header">
                  <h3>Notifications</h3>
                  <button (click)="markAllAsRead()">Mark all as read</button>
                </div>
                <div class="notification-list">
                  <div 
                    *ngFor="let notification of notifications" 
                    class="notification-item"
                    [class.unread]="!notification.isRead"
                    (click)="markAsRead(notification.id)"
                  >
                    <div class="notification-content">
                      <p class="notification-text">{{ notification.message }}</p>
                      <span class="notification-time">{{ notification.createdAt | date:'short' }}</span>
                    </div>
                  </div>
                  <div *ngIf="notifications.length === 0" class="notification-empty">
                    <p>No notifications</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Menu -->
            <div class="user-menu-container">
              <button class="user-menu-btn" (click)="toggleUserMenu()" aria-label="User menu">
                <div class="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
                <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>
              
              <div class="user-dropdown" *ngIf="showUserMenu">
                <div class="user-info">
                  <p class="user-email">{{ currentUser?.email }}</p>
                  <p class="user-role">{{ getUserRoleName(currentUser?.role) }}</p>
                </div>
                <div class="user-actions">
                  <a routerLink="/profile" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </a>
                  <a routerLink="/settings" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Settings
                  </a>
                  <button (click)="logout()" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
      transition: all var(--transition-normal);
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      background: var(--bg-card);
      border-right: 1px solid var(--gray-200);
      display: flex;
      flex-direction: column;
      transition: all var(--transition-normal);
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 1000;
      transform: translateX(0);
    }

    .sidebar.collapsed {
      transform: translateX(-100%);
    }

    .sidebar-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
      transition: color var(--transition-normal);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--spacing-lg) 0;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-fast);
      border-left: 3px solid transparent;
    }

    .nav-link:hover {
      background: var(--gray-100);
      color: var(--text-primary);
      border-left-color: var(--primary-color);
    }

    .nav-link.active {
      background: var(--primary-color);
      color: var(--text-inverse);
      border-left-color: var(--primary-dark);
    }

    .nav-link svg {
      flex-shrink: 0;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 280px;
      transition: margin-left var(--transition-normal);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .layout-container.sidebar-collapsed .main-content {
      margin-left: 0;
    }

    /* Header */
    .header {
      background: var(--bg-card);
      border-bottom: 1px solid var(--gray-200);
      padding: var(--spacing-lg) var(--spacing-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      transition: all var(--transition-normal);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .menu-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      transition: color var(--transition-normal);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .theme-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .theme-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    /* Notifications */
    .notification-container {
      position: relative;
    }

    .notification-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .notification-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--danger-color);
      color: var(--text-inverse);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .notification-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 320px;
      background: var(--bg-card);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      margin-top: var(--spacing-sm);
    }

    .notification-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .notification-header button {
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .notification-header button:hover {
      color: var(--primary-dark);
    }

    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .notification-item {
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--gray-100);
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .notification-item:hover {
      background: var(--gray-50);
    }

    .notification-item.unread {
      background: var(--primary-50);
    }

    .notification-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .notification-text {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .notification-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .notification-empty {
      padding: var(--spacing-xl);
      text-align: center;
      color: var(--text-muted);
    }

    /* User Menu */
    .user-menu-container {
      position: relative;
    }

    .user-menu-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .user-menu-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: inherit;
    }

    .dropdown-arrow {
      transition: transform var(--transition-fast);
    }

    .user-menu-btn:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 280px;
      background: var(--bg-card);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      margin-top: var(--spacing-sm);
    }

    .user-info {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--gray-200);
    }

    .user-email {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .user-role {
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: capitalize;
    }

    .user-actions {
      padding: var(--spacing-sm);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .dropdown-item:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    .dropdown-item svg {
      flex-shrink: 0;
    }

    /* Page Content */
    .page-content {
      flex: 1;
      padding: var(--spacing-xl);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.collapsed {
        transform: translateX(0);
      }

      .main-content {
        margin-left: 0;
      }

      .header {
        padding: var(--spacing-md) var(--spacing-lg);
      }

      .page-title {
        font-size: 1.25rem;
      }

      .user-name {
        display: none;
      }

      .notification-dropdown {
        width: 280px;
        right: -100px;
      }

      .user-dropdown {
        width: 240px;
        right: -50px;
      }
    }

    @media (max-width: 480px) {
      .header {
        padding: var(--spacing-sm) var(--spacing-md);
      }

      .page-title {
        font-size: 1.125rem;
      }

      .notification-dropdown {
        width: 240px;
        right: -80px;
      }

      .user-dropdown {
        width: 200px;
        right: -40px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  showNotifications = false;
  showUserMenu = false;
  pageTitle = 'Dashboard';
  currentUser: User | null = null;
  notifications: any[] = [];
  notificationCount = { total: 0, unread: 0 };
  isDarkMode = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.setupClickOutsideListener();
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadNotifications();
    this.setupThemeSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close notifications dropdown
    if (!target.closest('.notification-container')) {
      this.showNotifications = false;
    }
    
    // Close user menu dropdown
    if (!target.closest('.user-menu-container')) {
      this.showUserMenu = false;
    }
  }

  private setupClickOutsideListener(): void {
    // This is handled by the HostListener above
  }

  private loadUser(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
      this.cdr.detectChanges();
    });
  }

  private loadNotifications(): void {
    this.notificationService.notifications$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(notifications => {
      this.notifications = notifications;
      this.cdr.detectChanges();
    });

    this.notificationService.notificationCount$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.notificationCount = count;
      this.cdr.detectChanges();
    });
  }

  private setupThemeSubscription(): void {
    this.themeService.theme$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(theme => {
      this.isDarkMode = theme === 'dark';
      this.cdr.detectChanges();
    });
  }

  get isStudent(): boolean {
    return this.currentUser?.role === UserRole.STUDENT;
  }

  get isProfessor(): boolean {
    return this.currentUser?.role === UserRole.PROFESSOR;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === UserRole.ADMIN;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.cdr.detectChanges();
  }

  closeSidebarOnMobile(): void {
    // Only close sidebar on mobile when clicking on main content
    if (window.innerWidth <= 768 && !this.isSidebarCollapsed) {
      this.isSidebarCollapsed = true;
      this.cdr.detectChanges();
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false;
    }
    this.cdr.detectChanges();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
    this.cdr.detectChanges();
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getUserRoleName(role?: UserRole): string {
    switch (role) {
      case UserRole.STUDENT:
        return 'Student';
      case UserRole.PROFESSOR:
        return 'Professor';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return 'User';
    }
  }
} 