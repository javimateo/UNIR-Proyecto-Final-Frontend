export interface CartItem {
  id: number;
  name: string;
  image: string;
  variation?: string;
  price: number;
  quantity: number;
}

export interface ShippingZone {
  postalCodePrefix: string;
  cost: number;
  label: string;
}