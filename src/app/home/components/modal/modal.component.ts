import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/home/interfaces/user.interface';
import { UserService } from 'src/app/home/services/user.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TipoPersona } from 'src/app/home/interfaces/tipo-persona';
import { TipoPersonaService } from 'src/app/home/services/tipo-persona.service';
import { userDTO } from 'src/app/home/interfaces/userDTO';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
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
export class ModalComponent {
  @Input() userForm!: FormGroup;
  @Input() showModal!: boolean;
  @Input() editIndex: number | null = null;
  @Input() users: User[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() reloadData = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();
  public operationError: boolean = false;
  public operationSuccess: boolean = false;
  public isLoading: boolean = false;
  public operationType: 'crear' | 'editar' = 'crear';
  tiposPersona: TipoPersona[] = [];

  constructor(
    private userService: UserService,
    private tipoPersonaService: TipoPersonaService
  ) {}

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
    const {
      name = '',
      email = '',
      ciudad = '',
      estado = '',
      tipoPersona,
    } = this.userForm.value;
    const nombreTipoPersona =
      this.tiposPersona.find((t) => t.id === +tipoPersona)?.nombre || '';

    if (this.editIndex !== null && this.users[this.editIndex]) {
      return {
        ...this.users[this.editIndex],
        name: name ?? '',
        email: email ?? '',
        ciudad: ciudad ?? '',
        estado: estado ?? '',
        tipoPersona: {
          id: tipoPersona,
          nombre: nombreTipoPersona,
        },
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
          nombre: nombreTipoPersona,
        },
      };
    }
  }

  private createUserDTO(user: User): userDTO {
    return {
      name: user.name,
      email: user.email,
      ciudad: user.ciudad,
      estado: user.estado,
      tipoPersonaId: user.tipoPersona.id,
    };
  }

  addOrUpdateUser(): void {
    this.userForm.markAllAsTouched();
    if (!this.userForm.valid) return;
    this.isLoading = true;
    const userToBeSaved: User = this.getUserToBeSaved();
    const userToBeSent: userDTO = this.createUserDTO(userToBeSaved);
    let observable;

    if (this.editIndex !== null) {
      this.operationType = 'editar';
      observable = this.userService.updateUser(userToBeSaved.id, userToBeSent);
    } else {
      this.operationType = 'crear';
      observable = this.userService.createUser(userToBeSent);
    }

    observable.subscribe({
      next: (returnedUser: User) => {
        if (this.editIndex === null && returnedUser) {
          this.users.push(returnedUser);
        } else if (this.editIndex !== null) {
          this.users[this.editIndex] = returnedUser;
        }
        this.finalizeOperation(true);
      },
      error: (error) => {
        this.finalizeOperation(false);
        console.error('An error occurred:', error);
      },
    });
  }

  private finalizeOperation(success: boolean): void {
    this.isLoading = false;
    this.operationSuccess = success;
    this.reloadData.emit();
    if (success) {
      setTimeout(() => {
        this.operationSuccess = false;
        this.closeModal();
      }, 2000);
    }
  }
}

