import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="course-management">
      <div class="header">
        <h1>Course Management</h1>
        <p>Manage courses and lessons</p>
        <button class="btn btn-primary" (click)="showAddCourseForm = true">
          <span class="material-icons">add</span>
          Add New Course
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search courses..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            class="search-input"
          />
          <span class="material-icons search-icon">search</span>
        </div>
        
        <select [(ngModel)]="selectedCategory" (change)="onCategoryFilter()" class="category-filter">
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
        </select>
        
        <select [(ngModel)]="selectedStatus" (change)="onStatusFilter()" class="status-filter">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div class="courses-grid">
        <div class="course-card" *ngFor="let course of filteredCourses">
          <div class="course-image">
            <img [src]="course.thumbnail || 'assets/course-placeholder.jpg'" [alt]="course.title">
            <div class="course-status" [class]="'status-' + course.isPublished">
              {{ course.isPublished ? 'Published' : 'Draft' }}
            </div>
          </div>
          
          <div class="course-content">
            <h3>{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>
            
            <div class="course-meta">
              <div class="meta-item">
                <span class="material-icons">person</span>
                <span>{{ course.instructorName }}</span>
              </div>
              <div class="meta-item">
                <span class="material-icons">schedule</span>
                <span>{{ course.duration }} min</span>
              </div>
              <div class="meta-item">
                <span class="material-icons">group</span>
                <span>{{ course.enrolledStudents }} students</span>
              </div>
            </div>
            
            <div class="course-actions">
              <button class="btn-icon" (click)="editCourse(course)" title="Edit">
                <span class="material-icons">edit</span>
              </button>
              <button class="btn-icon" (click)="toggleCourseStatus(course)" title="Toggle Status">
                <span class="material-icons">{{ course.isPublished ? 'unpublish' : 'publish' }}</span>
              </button>
              <button class="btn-icon" (click)="manageLessons(course)" title="Manage Lessons">
                <span class="material-icons">list</span>
              </button>
              <button class="btn-icon delete" (click)="deleteCourse(course)" title="Delete">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Course Modal -->
      <div class="modal" *ngIf="showAddCourseForm || editingCourse">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingCourse ? 'Edit Course' : 'Add New Course' }}</h2>
            <button class="btn-icon" (click)="closeModal()">
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <form [formGroup]="courseForm" (ngSubmit)="saveCourse()">
            <div class="form-group">
              <label for="title">Course Title</label>
              <input type="text" id="title" formControlName="title" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" formControlName="description" class="form-control" rows="4"></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" formControlName="category" class="form-control">
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="level">Level</label>
                <select id="level" formControlName="level" class="form-control">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="duration">Duration (minutes)</label>
                <input type="number" id="duration" formControlName="duration" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="price">Price</label>
                <input type="number" id="price" formControlName="price" class="form-control" step="0.01">
              </div>
            </div>
            
            <div class="form-group">
              <label for="thumbnail">Thumbnail URL</label>
              <input type="url" id="thumbnail" formControlName="thumbnail" class="form-control">
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isPublished">
                Publish course immediately
              </label>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid">
                {{ editingCourse ? 'Update' : 'Create' }} Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-management {
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

    .category-filter,
    .status-filter {
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      min-width: 150px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .course-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .course-card:hover {
      transform: translateY(-2px);
    }

    .course-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-status {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .course-status.status-true {
      background: #d4edda;
      color: #155724;
    }

    .course-status.status-false {
      background: #f8d7da;
      color: #721c24;
    }

    .course-content {
      padding: 20px;
    }

    .course-content h3 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .course-description {
      color: #666;
      margin: 0 0 15px 0;
      font-size: 14px;
      line-height: 1.4;
    }

    .course-meta {
      margin-bottom: 15px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }

    .meta-item .material-icons {
      font-size: 16px;
      color: #999;
    }

    .course-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
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
      max-width: 600px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
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

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
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

      .courses-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CourseManagementComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';
  showAddCourseForm = false;
  editingCourse: any = null;
  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['programming', Validators.required],
      level: ['Beginner', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      thumbnail: [''],
      isPublished: [false]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    // Mock data
    this.courses = [
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        category: 'programming',
        level: 'Beginner',
        duration: 120,
        price: 29.99,
        instructorName: 'John Doe',
        enrolledStudents: 150,
        isPublished: true,
        thumbnail: 'assets/course-1.jpg'
      },
      {
        id: '2',
        title: 'Advanced React Development',
        description: 'Master React with advanced concepts',
        category: 'programming',
        level: 'Advanced',
        duration: 180,
        price: 49.99,
        instructorName: 'Jane Smith',
        enrolledStudents: 75,
        isPublished: false,
        thumbnail: 'assets/course-2.jpg'
      }
    ];
    this.filteredCourses = this.courses;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryFilter(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchQuery || 
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || course.category === this.selectedCategory;
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'published' && course.isPublished) ||
        (this.selectedStatus === 'draft' && !course.isPublished);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  editCourse(course: any): void {
    this.editingCourse = course;
    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      price: course.price,
      thumbnail: course.thumbnail,
      isPublished: course.isPublished
    });
  }

  saveCourse(): void {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;
      if (this.editingCourse) {
        // Update existing course
        console.log('Updating course:', courseData);
      } else {
        // Create new course
        console.log('Creating course:', courseData);
      }
      this.closeModal();
    }
  }

  toggleCourseStatus(course: any): void {
    course.isPublished = !course.isPublished;
    console.log('Toggled course status:', course);
  }

  manageLessons(course: any): void {
    console.log('Managing lessons for course:', course);
  }

  deleteCourse(course: any): void {
    if (confirm('Are you sure you want to delete this course?')) {
      console.log('Deleting course:', course);
    }
  }

  closeModal(): void {
    this.showAddCourseForm = false;
    this.editingCourse = null;
    this.courseForm.reset({
      category: 'programming',
      level: 'Beginner',
      duration: 0,
      price: 0,
      isPublished: false
    });
  }
} 