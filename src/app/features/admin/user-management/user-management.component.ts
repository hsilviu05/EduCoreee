import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="user-management">
      <div class="header">
        <h1>User Management</h1>
        <p>Manage user accounts and permissions</p>
        <button class="btn btn-primary" (click)="showAddUserForm = true">
          <span class="material-icons">add</span>
          Add New User
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search users..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            class="search-input"
          />
          <span class="material-icons search-icon">search</span>
        </div>
        
        <select [(ngModel)]="selectedRole" (change)="onRoleFilter()" class="role-filter">
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="PROFESSOR">Professor</option>
          <option value="ADMIN">Admin</option>
        </select>
        
        <select [(ngModel)]="selectedStatus" (change)="onStatusFilter()" class="status-filter">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td class="user-info">
                <div class="user-avatar">
                  <img [src]="user.avatar || 'assets/default-avatar.png'" [alt]="user.firstName">
                </div>
                <div class="user-details">
                  <h4>{{ user.firstName }} {{ user.lastName }}</h4>
                  <p>{{ user.email }}</p>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class]="'status-' + user.isActive">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>{{ user.createdAt | date:'short' }}</td>
              <td>{{ user.lastLoginAt | date:'short' }}</td>
              <td class="actions">
                <button class="btn-icon" (click)="editUser(user)" title="Edit">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn-icon" (click)="toggleUserStatus(user)" title="Toggle Status">
                  <span class="material-icons">{{ user.isActive ? 'block' : 'check_circle' }}</span>
                </button>
                <button class="btn-icon delete" (click)="deleteUser(user)" title="Delete">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit User Modal -->
      <div class="modal" *ngIf="showAddUserForm || editingUser">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
            <button class="btn-icon" (click)="closeModal()">
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <form [formGroup]="userForm" (ngSubmit)="saveUser()">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" formControlName="firstName" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" formControlName="lastName" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="role">Role</label>
              <select id="role" formControlName="role" class="form-control">
                <option value="STUDENT">Student</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <div class="form-group" *ngIf="!editingUser">
              <label for="password">Password</label>
              <input type="password" id="password" formControlName="password" class="form-control">
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">
                {{ editingUser ? 'Update' : 'Create' }} User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-management {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .header p {
      color: #666;
      margin: 0;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 45px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
    }

    .role-filter,
    .status-filter {
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      min-width: 150px;
    }

    .users-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #e1e5e9;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details h4 {
      margin: 0 0 4px 0;
      color: #2c3e50;
    }

    .user-details p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .role-badge,
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-badge.role-student {
      background: #d1ecf1;
      color: #0c5460;
    }

    .role-badge.role-professor {
      background: #fff3cd;
      color: #856404;
    }

    .role-badge.role-admin {
      background: #f8d7da;
      color: #721c24;
    }

    .status-badge.status-true {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.status-false {
      background: #f8d7da;
      color: #721c24;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-icon:hover {
      background: #f8f9fa;
    }

    .btn-icon.delete:hover {
      background: #f8d7da;
      color: #721c24;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .users-table {
        overflow-x: auto;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';
  showAddUserForm = false;
  editingUser: any = null;
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['STUDENT', Validators.required],
      password: ['', Validators.minLength(6)]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Mock data
    this.users = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'STUDENT',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date('2024-01-20')
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'PROFESSOR',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        lastLoginAt: new Date('2024-01-19')
      }
    ];
    this.filteredUsers = this.users;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onRoleFilter(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchQuery || 
        user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && user.isActive) ||
        (this.selectedStatus === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  editUser(user: any): void {
    this.editingUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.editingUser) {
        // Update existing user
        console.log('Updating user:', userData);
      } else {
        // Create new user
        console.log('Creating user:', userData);
      }
      this.closeModal();
    }
  }

  toggleUserStatus(user: any): void {
    user.isActive = !user.isActive;
    console.log('Toggled user status:', user);
  }

  deleteUser(user: any): void {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', user);
    }
  }

  closeModal(): void {
    this.showAddUserForm = false;
    this.editingUser = null;
    this.userForm.reset({
      role: 'STUDENT'
    });
  }
} 