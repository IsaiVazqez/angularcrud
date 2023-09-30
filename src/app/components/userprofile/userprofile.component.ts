import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoPersona } from 'src/app/interface/tipo-persona';
import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services/user.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { userDTO } from 'src/app/interface/userDTO';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent {
  user!: User;
  tiposPersona: TipoPersona[] = [];
  tipoPersonaControl = new FormControl('');
  public newTipoPersona: string = '';
  public showAddTypeField: boolean = false;
  showDeleteTypeField = false;
  showSuccessMessage: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private tipoPersonaService: TipoPersonaService,
    private router: Router
  ) {
    this.tipoPersonaControl.valueChanges.subscribe((newTipo) => {
      if (newTipo !== null && newTipo !== '') {
      }
    });
  }

  initializeUserProfile(id: number): void {
    this.userService.getUserById(id).subscribe(
      user => {
        if (user) {
          this.user = user;
          const tipoPersonaId = this.user.tipoPersona?.id === 0 ? '' : this.user.tipoPersona?.id.toString();
          this.tipoPersonaControl.setValue(tipoPersonaId);
        }
      },
      error => {
        console.error('Ocurrió un error:', error);
        this.router.navigate(['/error']);
      }
    );
  }

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? +idStr : null;
    if (id !== null && !isNaN(id) && id !== 0) {
      this.userService.getUserById(id).subscribe(
        (user) => {
          if (user) {
            this.user = user;
          }
        },
        (error) => {
          console.error('Ocurrió un error:', error);
          this.router.navigate(['/error']);
        }
      );

      this.tipoPersonaService.getTypes().subscribe(
        (tipos) => {
          if (tipos) {
            this.tiposPersona = tipos;
            this.initializeUserProfile(id);
          }
        },
        (error) => {
          console.error('Ocurrió un error:', error);
          this.router.navigate(['/error']);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  addTipoPersona() {

    const tipoToAdd: TipoPersona = { id: 0, nombre: this.newTipoPersona };

    this.tipoPersonaService.createTypes(tipoToAdd).subscribe(
      (newTipo) => {
        this.tiposPersona.push(newTipo);
        this.newTipoPersona = '';
        this.showAddTypeField = false;
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      (error) => {
        console.error('Ocurrió un error:', error);
      }
    );
  }

  confirmDelete(id: number) {

    if (window.confirm('¿Seguro quieres eliminarlo?')) {
      this.tipoPersonaService.deleteType(id).subscribe(
        () => {
          alert('Tipo eliminado');
          this.loadTiposPersona();
        },
        (error) => {
          if (
            error.error.message ===
            'Este tipo de persona ya está asignado a un usuario y no puede ser eliminado.'
          ) {
            alert(
              'Este tipo de persona ya le pertenece a alguien y no puede ser eliminado.'
            );
          } else {
            alert('Error al eliminar tipo de persona');
          }
        }
      );
    }
  }

  loadTiposPersona() {
    this.tipoPersonaService.getTypes().subscribe(
      (tipos) => {
        this.tiposPersona = tipos;
      },
    );
  }

  saveChanges() {
    if (this.tipoPersonaControl.valid) {
      const selectedTipoPersonaId = +this.tipoPersonaControl.value!;
      const updatedUser: userDTO = {
        name: this.user.name,
        email: this.user.email,
        ciudad: this.user.ciudad,
        estado: this.user.estado,
        tipoPersonaId: selectedTipoPersonaId,
      };
      this.userService.updateUser(this.user.id, updatedUser).subscribe(
        (updated) => {
          this.user = {
            ...this.user,
            tipoPersona: { id: selectedTipoPersonaId, nombre: '' },
          };
          window.alert('El tipo de persona se ha actualizado correctamente.');
        },
        (error) => {
          console.error('Error al actualizar el tipo de persona:', error);
          window.alert(
            'Hubo un error al actualizar. Por favor, inténtelo de nuevo.'
          );
        }
      );
    } else {
      window.alert('Por favor, seleccione un tipo de persona válido.');
    }
  }
}
