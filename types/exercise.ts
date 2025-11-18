import z from "zod";

export const exerciseFormSchema = z.object({
  weight: z
    .number()
    .min(0, "Carga deve ser maior ou igual a 0")
    .nonnegative("Carga não pode ser negativa"),
  sets: z
    .number()
    .min(1, "Séries deve ser maior que 0")
    .positive("Séries deve ser um número positivo")
    .int("Séries deve ser um número inteiro"),
  reps: z
    .number()
    .min(1, "Repetições deve ser maior que 0")
    .positive("Repetições deve ser um número positivo")
    .int("Repetições deve ser um número inteiro"),
  notes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;
