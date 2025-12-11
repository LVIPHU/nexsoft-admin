import { z } from 'zod';

import { roleSchema } from '../role/role.js';
import { userSchema } from '../user/user.js';

export const adminSchema = userSchema.omit({ user_id: true }).extend({
  id: z.number(),
  roles: z.array(roleSchema),
  password: z.string(),
});

export type AdminDto = z.infer<typeof adminSchema>;
