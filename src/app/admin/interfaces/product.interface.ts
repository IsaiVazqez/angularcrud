export interface Product {
  id:      number;
  nombre:  string;
  precio:  number;
  idImage: number;
  image:   Image;
}

export interface Image {
  id:  number;
  url: string;
}
