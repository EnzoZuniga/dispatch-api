import { z } from 'zod';

export const createMissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  location: z.string().min(1),
});

export const updateMissionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export const assignMissionSchema = z.object({
  technicianId: z.string().min(1),
});

export const updateStatusSchema = z.object({
  status: z.enum(['draft', 'assigned', 'en_route', 'on_site', 'done', 'cancelled']),
});

export type CreateMissionInput = z.infer<typeof createMissionSchema>;
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>;
export type AssignMissionInput = z.infer<typeof assignMissionSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
