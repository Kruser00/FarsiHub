export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML
  category: string;
  imageUrl: string;
  author: Author;
  date: string;
  readTime: string;
  views: number;
  tags: string[];
  citations?: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface Stats {
  totalViews: number;
  totalRevenue: number;
  postsGenerated: number;
}

export enum Category {
  TECH = 'تکنولوژی',
  CINEMA = 'سینما و هنر',
  GAMES = 'بازی‌های ویدیویی',
  COOKING = 'آشپزی',
  TOURISM = 'گردشگری',
  SCIENCE = 'علمی',
}