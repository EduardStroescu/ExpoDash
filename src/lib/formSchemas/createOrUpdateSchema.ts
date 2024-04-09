import { z } from "zod";

export const FormSchema = z.object({
  name: z
    .string({ required_error: "A product name is required" })
    .min(5, { message: "Name must contain at least three characters." }),
  image: z.string().nullable(),
  description: z
    .string({ required_error: "A product description is required" })
    .min(10, {
      message: "Product description must contain at least ten characters.",
    }),
  s_price: z
    .union([z.string(), z.number()], {
      required_error: "A small variant price is required.",
    })
    .refine(
      (val): val is string | number => {
        if (typeof val === "string") {
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue);
        } else {
          return typeof val === "number";
        }
      },
      {
        message: "S Price must be a number.",
      },
    )
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
  m_price: z
    .union([z.string(), z.number()], {
      required_error: "A Medium variant price is required.",
    })
    .refine(
      (val): val is string | number => {
        if (typeof val === "string") {
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue);
        } else {
          return typeof val === "number";
        }
      },
      {
        message: "M Price must be a number.",
      },
    )
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
  l_price: z
    .union([z.string(), z.number()], {
      required_error: "A Large variant price is required.",
    })
    .refine(
      (val): val is string | number => {
        if (typeof val === "string") {
          // Convert string to number if possible
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue);
        } else {
          return typeof val === "number";
        }
      },
      {
        message: "L Price must be a number.",
      },
    )
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
  xl_price: z
    .union([z.string(), z.number()], {
      required_error: "A Extra Large variant price is required.",
    })
    .refine(
      (val): val is string | number => {
        if (typeof val === "string") {
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue);
        } else {
          return typeof val === "number";
        }
      },
      {
        message: "XL Price must be a number.",
      },
    )
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
});
