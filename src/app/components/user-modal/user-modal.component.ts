import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
 animations: [
  trigger('fadeInOut', [
    state('void', style({
      opacity: 0
    })),
    transition('void <=> *', animate(300)),
  ])
]
})

export class UserModalComponent {
  @Input() userForm!: FormGroup;
  @Input() showModal!: boolean;
  @Input() editIndex: number | null = null;
  @Input() users: User[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();
  public operationError: boolean = false;
  public operationSuccess: boolean = false;
  public isLoading: boolean = false;

  constructor(private userService: UserService) {

  }

  closeModal(): void {
    this.showModal = false;
    this.userForm.reset();
    this.editIndex = null;
    this.closeModalEvent.emit();  // Emitir el evento al cerrar

  }

  addOrUpdateUser(): void {
    this.userForm.markAllAsTouched();
    if (!this.userForm.valid) {
      return;
    }

    this.isLoading = true;

    const { name = '', email = '', ciudad = '', estado = '' } = this.userForm.value;
    const id = this.editIndex !== null ? this.users[this.editIndex].id : this.users.length + 1;
    const newUser: User = {
      id,
      name: name ?? '',
      email: email ?? '',
      ciudad: ciudad ?? '',
      estado: estado ?? '',
      tipoPersonaId: 0,
    };

    const observable = this.editIndex !== null ?
      this.userService.updateUser(newUser.id, newUser) :
      this.userService.createUser(newUser);

    observable.subscribe(() => {

      this.isLoading = false;
      this.operationSuccess = true;

      setTimeout(() => {
        this.operationSuccess = false;
        this.closeModal();

      }, 2000);
    }, error => {
      this.isLoading = false;
      this.operationError = true;
      console.error('An error occurred:', error);
    });
  }


  updateExistingUser(user: User): void {
    this.userService.updateUser(user.id, user).subscribe(() => {
      this.users[this.editIndex as number] = user;
      this.closeModal();
    }, error => {
      console.error('An error occurred:', error);
    });
  }

  createAndAddUser(user: User): void {
    this.userService.createUser(user).subscribe((createdUser: User) => {

      this.users.push(createdUser);

      this.closeModal();

    }, error => {
      console.error('An error occurred:', error);
    });
  }
}
