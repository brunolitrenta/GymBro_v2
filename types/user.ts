import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome obrigatório"),
    userType: z.enum(["normal", "trainer"], {
      message: "Selecione o tipo de usuário",
    }),
    gender: z
      .enum(["M", "F", "O"], {
        message: "Selecione o gênero",
      })
      .optional(),
    birthDate: z
      .union([
        z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida"),
        z.literal(""),
      ])
      .optional(),
    weight: z
      .union([
        z.number().min(1, { message: "Peso deve ser maior que 0" }),
        z.string().refine(
          (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
          },
          { message: "Peso deve ser maior que 0" }
        ),
        z.literal("")
      ])
      .optional(),
    height: z
      .union([
        z.number().min(1, { message: "Altura deve ser maior que 0" }),
        z.string().refine(
          (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
          },
          { message: "Altura deve ser maior que 0" }
        ),
        z.literal("")
      ])
      .optional(),
    goal: z
      .enum(["weight_loss", "muscle_gain", "other"], {
        message: "Selecione um objetivo",
      })
      .optional(),
    workoutDays: z.array(z.number().min(0).max(6)).optional(),
    medical: z.string().max(200, "Máximo 200 caracteres"),
    email: z.email("E-mail inválido").nonempty("E-mail obrigatório"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória").min(6, "Mínimo 6 caracteres"),
});

export const personalDataSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido").nonempty("E-mail obrigatório"),
  gender: z.enum(["M", "F", "O"], {
    message: "Selecione o gênero",
  }),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (DD/MM/AAAA)"),
  height: z
    .union([
      z.number().min(1, { message: "Altura deve ser maior que 0" }),
      z.string().refine(
        (val) => {
          if (val === "") return false;
          const num = parseFloat(val);
          return !isNaN(num) && num > 0;
        },
        { message: "Altura deve ser maior que 0" }
      ),
    ]),
  weight: z
    .union([
      z.number().min(1, { message: "Peso deve ser maior que 0" }),
      z.string().refine(
        (val) => {
          if (val === "") return false;
          const num = parseFloat(val);
          return !isNaN(num) && num > 0;
        },
        { message: "Peso deve ser maior que 0" }
      ),
    ]),
  goal: z.enum(["weight_loss", "muscle_gain", "other"], {
    message: "Selecione um objetivo",
  }),
  workoutDays: z.array(z.number().min(0).max(6)).min(1, "Selecione pelo menos um dia"),
  medical: z.string().max(200, "Máximo 200 caracteres").optional(),
});
