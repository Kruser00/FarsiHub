import { Author, Category } from './types';

// Weighted Categories for "Smart Strategy"
// Viral topics have higher frequency
export const CATEGORY_WEIGHTS: Record<Category, number> = {
  [Category.TECH]: 0.3,
  [Category.CINEMA]: 0.25,
  [Category.GAMES]: 0.2,
  [Category.COOKING]: 0.1,
  [Category.TOURISM]: 0.1,
  [Category.SCIENCE]: 0.05,
};

export const AUTHORS: Record<Category, Author> = {
  [Category.TECH]: {
    id: 'a1',
    name: 'آرش مهندس',
    role: 'سردبیر تکنولوژی',
    avatar: 'https://picsum.photos/seed/arash/100/100',
  },
  [Category.CINEMA]: {
    id: 'a2',
    name: 'سارا سینما',
    role: 'منتقد فیلم',
    avatar: 'https://picsum.photos/seed/sara/100/100',
  },
  [Category.GAMES]: {
    id: 'a3',
    name: 'نیما گیمر',
    role: 'کارشناس بازی',
    avatar: 'https://picsum.photos/seed/nima/100/100',
  },
  [Category.COOKING]: {
    id: 'a4',
    name: 'مریم بانو',
    role: 'سرآشپز',
    avatar: 'https://picsum.photos/seed/maryam/100/100',
  },
  [Category.TOURISM]: {
    id: 'a5',
    name: 'کامران جهانگرد',
    role: 'راهنمای سفر',
    avatar: 'https://picsum.photos/seed/kamran/100/100',
  },
  [Category.SCIENCE]: {
    id: 'a6',
    name: 'دکتر دانش',
    role: 'پژوهشگر',
    avatar: 'https://picsum.photos/seed/dr/100/100',
  },
};

export const SEED_POSTS: any[] = [
  {
    id: 'seed-1',
    title: 'خوش آمدید به فارسی هاب',
    excerpt: 'این اولین پست آزمایشی سیستم تولید محتوای خودکار است.',
    content: '<p>این سیستم به صورت خودکار اخبار و مقالات جذاب تولید می‌کند.</p>',
    category: Category.TECH,
    imageUrl: 'https://picsum.photos/seed/tech/800/400',
    author: AUTHORS[Category.TECH],
    date: new Date().toLocaleDateString('fa-IR'),
    readTime: '۱ دقیقه',
    views: 120,
    tags: ['هوش مصنوعی', 'آغاز'],
  }
];