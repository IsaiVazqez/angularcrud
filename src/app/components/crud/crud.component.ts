import { Component, OnInit, HostListener } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})

export class CrudComponent implements OnInit {

  public userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    ciudad: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    tipoPersona: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService, private router: Router) { }
  private ngUnsubscribe = new Subject<void>();

  users: User[] = [];
  showModal: boolean = false;
  editIndex: number | null = null;
  private usersSub: Subscription = new Subscription();
  public isSmallScreen: boolean | undefined;
  toDeleteIndex: number | null = null;
  public showDeleteModal: boolean = false;


  @HostListener('window:resize', ['$event'])

  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      // Modo celular
      this.isSmallScreen = true;
    } else {
      // Modo computadora
      this.isSmallScreen = false;
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.onResize);

    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });

    this.userService.userChanged.subscribe(() => {
      this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users;
      });
    });

  }

  ngOnDestroy(): void {

  }


  openModal(index?: number): void {
    this.showModal = true;
    if (index !== undefined) {
      this.editIndex = index;
      const user = this.users[index];
      const tipoPersonaId = user.tipoPersona?.id === 0 ? '' : user.tipoPersona?.id.toString();

      this.userForm.setValue({
        name: user.name ?? '',
        email: user.email ?? '',
        ciudad: user.ciudad ?? '',
        estado: user.estado ?? '',
        tipoPersona: tipoPersonaId
      });
    }
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

confirmDelete(): void {
  if (this.toDeleteIndex !== null) {
    const userId = this.users[this.toDeleteIndex].id;
    this.userService.deleteUser(userId).subscribe(
      () => {
        if (this.toDeleteIndex !== null) {
          this.users.splice(this.toDeleteIndex, 1);
          this.toDeleteIndex = null;
        }
      },
      (error) => {
        console.error('Error eliminando usuario:', error);
      }
    );
  }
  this.closeDeleteModal();
}


viewUserProfile(id: number): void {
  console.log("cscasc");
  this.router.navigate([`/userprofile/${id}`]);
}

}

