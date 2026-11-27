import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(6),
});

export const categorySchema = z.object({
  nameUz: z.string().min(1),
  nameRu: z.string().min(1),
  nameEn: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  nameUz: z.string().min(1),
  nameRu: z.string().min(1),
  nameEn: z.string().optional(),
  descriptionUz: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().int().positive(),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  weight: z.string().optional(),
  calories: z.number().int().optional(),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  categoryId: z.string(),
});

export const promotionSchema = z.object({
  titleUz: z.string().min(1),
  titleRu: z.string().min(1),
  titleEn: z.string().optional(),
  subtitleUz: z.string().optional(),
  subtitleRu: z.string().optional(),
  subtitleEn: z.string().optional(),
  badge: z.string().optional(),
  imageUrl: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const settingSchema = z.record(z.string());

export const waiterCallSchema = z.object({
  table: z.number().int().min(1).max(999),
});
