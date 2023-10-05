import { userDTO } from "./userDTO";

export interface MainDTO {
  data:       userDTO[];
  total:      number;
  pageSize:   number;
  pageNumber: number;
}
