import { z } from 'zod';

import { adminSchema } from './admin.js';

export const deleteAdminSchema = z.array(adminSchema.pick({ id: true }));

export type DeleteAdminDto = z.infer<typeof deleteAdminSchema>;
