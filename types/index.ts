export interface Menu {
  id: string
  name: string
  description: string
  price: string
  category: string
  image: string
  is_periodic: string
  day: string
}

export interface Order {
  id: string
  name: string
  phone: string
  location: string
  menu_id: string
  menu_name: string
  total_price: string
  date: string
  status: string
  delivery_date: string
  delivery_time: string
  quantity: string
}