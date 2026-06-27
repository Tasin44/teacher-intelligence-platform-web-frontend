import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rollNo: z.string().min(1, 'Roll number is required'),
  grade: z.string().min(1, 'Target grade is required'),
  riskLevel: z.enum(['At Risk', 'On Track', 'Advanced', 'Developing'], {
    message: 'Please select a valid risk level',
  }),
  readingLevel: z.string().min(1, 'Reading placement is required'),
  parentName: z.string().optional().or(z.literal('')),
  parentEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export type TStudentInput = z.infer<typeof studentSchema>;
