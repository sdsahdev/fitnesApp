export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  weight?: number;
  height?: number;
  goals?: string[];
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  calories: number;
  isPremium: boolean;
  videoUrl?: string;
}
