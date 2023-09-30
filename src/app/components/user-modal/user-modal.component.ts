import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services/user.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TipoPersona } from 'src/app/interface/tipo-persona';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { userDTO } from 'src/app/interface/userDTO';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(300)),
    ]),
  ],
})
export class UserModalComponent {
  @Input() userForm!: FormGroup;
  @Input() showModal!: boolean;
  @Input() editIndex: number | null = null;
  @Input() users: User[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() userSuccessfullyEdited = new EventEmitter<User>();
  @Output() userUpdated = new EventEmitter<void>();
  public operationError: boolean = false;
  public operationSuccess: boolean = false;
  public isLoading: boolean = false;
  tiposPersona: TipoPersona[] = [];

  constructor(
    private userService: UserService,
    private tipoPersonaService: TipoPersonaService
  ) { }
  ngOnInit() {
    this.tipoPersonaService.getTypes().subscribe((data: TipoPersona[]) => {
      this.tiposPersona = data;
    });
  }
  closeModal(): void {
    this.showModal = false;
    this.userForm.reset();
    this.editIndex = null;
    this.closeModalEvent.emit();
  }

  getUserToBeSaved(): User {
    const { name = '', email = '', ciudad = '', estado = '', tipoPersona } = this.userForm.value;
    const nombreTipoPersona = this.tiposPersona.find(t => t.id === +tipoPersona)?.nombre || '';
    if (this.editIndex !== null && this.users[this.editIndex]) {
      return {
        ...this.users[this.editIndex],
        name: name ?? '',
        email: email ?? '',
        ciudad: ciudad ?? '',
        estado: estado ?? '',
        tipoPersona: {
          id: tipoPersona,
          nombre: nombreTipoPersona
        }
      };
    } else {
      return {
        id: 0,
        name: name ?? '',
        email: email ?? '',
        ciudad: ciudad ?? '',
        estado: estado ?? '',
        tipoPersona: {
          id: tipoPersona,
          nombre: nombreTipoPersona
        }
      };
    }
  }


  addOrUpdateUser(): void {
    this.userForm.markAllAsTouched();
    if (!this.userForm.valid) {
      return;
    }
    this.isLoading = true;
    const userToBeSaved: User = this.getUserToBeSaved();
    const userToBeSent: userDTO = {
      name: userToBeSaved.name,
      email: userToBeSaved.email,
      ciudad: userToBeSaved.ciudad,
      estado: userToBeSaved.estado,
      tipoPersonaId: userToBeSaved.tipoPersona.id
    };
    let observable;
    if (this.editIndex !== null) {
      observable = this.userService.updateUser(userToBeSaved.id, userToBeSent);
    } else {
      observable = this.userService.createUser(userToBeSent);
    }
    observable.subscribe(
      (returnedUser: User) => {
        if (this.editIndex === null && returnedUser) {
          this.users.push(returnedUser);
        } else if (this.editIndex !== null) {
          this.users[this.editIndex] = returnedUser;
        }
        this.isLoading = false;
        this.operationSuccess = true;
        this.userSuccessfullyEdited.emit(returnedUser);
        setTimeout(() => {
          this.operationSuccess = false;
          this.closeModal();
        }, 2000);
      },
      (error) => {
        this.isLoading = false;
        this.operationError = true;
        console.error('An error occurred:', error);
      }
    );
  }
}

