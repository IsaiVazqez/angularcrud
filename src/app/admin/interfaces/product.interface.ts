export interface Product {
  id:      number;
  nombre:  string;
  precio:  number;
  idImage: number;
  image:   Image;
  quantity?: number;  // Esta es la propiedad nueva
}

export interface Image {
  id:  number;
  url: string;
}
