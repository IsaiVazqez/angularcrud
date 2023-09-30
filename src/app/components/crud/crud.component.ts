import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services/user.service';
import { MainDTO } from 'src/app/interface/paginacionDTO';
import { userDTO } from 'src/app/interface/userDTO';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
})
export class CrudComponent implements OnInit {
  public userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    ciudad: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    tipoPersona: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private router: Router) { }
  users: any[] = [];
  public user: userDTO[] = [];
  showModal: boolean = false;
  editIndex: number | null = null;
  toDeleteIndex: number | null = null;
  mainDTO: MainDTO[] = [];
  public isSmallScreen: boolean | undefined;
  public showDeleteModal: boolean = false;
  public total: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public pageNumber: number = 1;
  public orderDirection: string = 'desc';

  ngOnInit(): void {
    this.loadUsers();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.onResize());

    this.userService
      .getUsers(this.pageNumber, this.pageSize, this.orderDirection)
      .subscribe((mainDTO: MainDTO) => {
        this.user = mainDTO.data;
      });

    this.userService.userChanged.subscribe(() => {
      this.userService
        .getUsers(this.pageNumber, this.pageSize, this.orderDirection)
        .subscribe((mainDTO: MainDTO) => {
          this.user = mainDTO.data;
        });
    });
  }

  loadUsers() {
    this.userService
      .getUsers(this.pageSize, this.pageNumber, this.orderDirection)
      .subscribe((response) => {
        this.users = response.data;
        this.totalPages = Math.ceil(response.total / this.pageSize);
        this.total = response.total;
        this.pageSize = response.pageSize;
        this.pageNumber = response.pageNumber;
      });
  }

  toggleOrderDirection(): void {
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.loadUsers();
  }


  openModal(index?: number): void {
    this.showModal = true;
    if (index !== undefined) {
      this.editIndex = index;
      const user = this.users[index];
      const tipoPersonaId =
        user.tipoPersona?.id === 0 ? '' : user.tipoPersona?.id.toString();

      this.userForm.setValue({
        name: user.name ?? '',
        email: user.email ?? '',
        ciudad: user.ciudad ?? '',
        estado: user.estado ?? '',
        tipoPersona: tipoPersonaId,
      });
    }
  }

  confirmDelete(): void {
    if (this.toDeleteIndex !== null) {
      const userId = this.users[this.toDeleteIndex].id;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          if (this.toDeleteIndex !== null) {
            this.users.splice(this.toDeleteIndex, 1);
            this.toDeleteIndex = null;
          }
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          this.closeDeleteModal();
        },
      });
    } else {
      this.closeDeleteModal();
    }
  }


  downloadExcel() {
    this.userService.downloadExcel().subscribe((data: Blob) => {
      const a = document.createElement('a')
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'Users.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  closeModal(): void {
    this.showModal = false;
    this.userForm.reset();
    this.userForm.get('tipoPersona')?.setValue('');
    this.editIndex = null;
  }

  editUser(index: number): void {
    this.openModal(index);
  }

  openDeleteModal(index: number): void {
    this.toDeleteIndex = index;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.toDeleteIndex = null;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadUsers();
    }
  }

  nextPage() {
    this.pageNumber++;
    this.loadUsers();
  }

  updatePageSize() {
    this.pageNumber = 1;
    this.loadUsers();
  }

  private checkScreenSize() {
    if (window.innerWidth < 1024) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  viewUserProfile(id: number): void {
    this.router.navigate([`/userprofile/${id}`]);
  }

  goToFirstPage() {
    this.pageNumber = 1;
    this.loadUsers();
  }

  goToLastPage() {
    this.pageNumber = this.totalPages;
    this.loadUsers();
  }

  updateEditedUser(editedUser: User) {
    if (this.editIndex !== null) {
      this.users[this.editIndex] = editedUser;
    }
  }

}
