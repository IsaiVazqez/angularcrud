import { TipoPersona } from "./tipo-persona";

export interface User {
  id:            number;
  name:          string;
  email:         string;
  ciudad:        string;
  estado:        string;
  tipoPersona: TipoPersona;
}

