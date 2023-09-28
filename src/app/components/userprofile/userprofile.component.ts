import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoPersona } from 'src/app/interface/tipo-persona';
import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services/user.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { Router } from '@angular/router';  // Importar el Router

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {
  user!: User;
  tiposPersona: TipoPersona[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private tipoPersonaService: TipoPersonaService,
    private router: Router  // Inyectar el Router

  ) { }

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? +idStr : null;

    if (id !== null && !isNaN(id) && id !== 0) {
      this.userService.getUserById(id).subscribe(
        user => {
          if (user) {
            this.user = user;
          }
        },
        error => {
          console.error('Ocurrió un error:', error);
          this.router.navigate(['/error']);
        }
      );
      this.tipoPersonaService.getTypes().subscribe(
        tipos => {
          if (tipos) {
            this.tiposPersona = tipos;
          }
        },
        error => {
          console.error('Ocurrió un error:', error);
          this.router.navigate(['/error']);
        }
      );
    }
  }


  updateTipoPersona(tipoPersonaId: number): void {
    if (this.user && this.user.id !== undefined && this.user.id !== null) {
      this.user.tipoPersonaId = tipoPersonaId;
      this.userService.updateUser(this.user.id, this.user).subscribe(
        updatedUser => {
          if (updatedUser !== null) {
            this.user = updatedUser;
          } else {
            console.error('El usuario actualizado es null');
            this.router.navigate(['/error']);
          }
        },
        error => {
          console.error('Ocurrió un error durante la actualización:', error);
          this.router.navigate(['/error']);
        }
      );
    } else {
      console.error('this.user o this.user.id son null');
      this.router.navigate(['/error']);
    }
  }
  goBack() {
    this.router.navigate(['/']); // Asume que tu ruta para el inicio es '/'
  }

}
