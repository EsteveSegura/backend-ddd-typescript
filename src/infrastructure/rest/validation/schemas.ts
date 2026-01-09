import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ message: 'Title must be a string' })
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  description: z
    .string({ message: 'Description must be a string' })
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
    .nullable(),
});

export const updateTodoSchema = z.object({
  title: z
    .string({ message: 'Title must be a string' })
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must not exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string({ message: 'Description must be a string' })
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
    .nullable(),
  status: z
    .enum(['PENDING', 'COMPLETED'], { message: 'Status must be PENDING or COMPLETED' })
    .optional(),
});

export const todoIdParamSchema = z.object({
  id: z
    .string({ message: 'Todo ID is required' })
    .uuid('Invalid Todo ID format'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoIdParam = z.infer<typeof todoIdParamSchema>;
