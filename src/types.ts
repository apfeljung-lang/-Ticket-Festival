export interface Mission {
  id: string;
  title: string;
  condition: string;
  tickets: number;
  status: 'available' | 'pending' | 'completed';
}

export interface Prize {
  id: string;
  category: 'GRAND' | 'LUCKY' | 'GUARANTEED';
  title: string;
  subtitle: string;
  requiredTickets: number;
  benefit: string;
  participants: number;
  deadlineDays: number;
  imageUrl?: string;
}

export interface UserStatus {
  name: string;
  tickets: number;
  points?: number;
}
