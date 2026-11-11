import { z } from 'zod';

import type { Property, PropertyInput } from '@/types/domain';
import { hectaresToInput, parseHectares } from '@/utils/format';

/** Regras seguem o contrato da API: nome e cidade com 2+ caracteres, UF com 2 letras, área > 0. */
export const propertySchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da propriedade.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
  state: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, 'Informe a sigla do estado (ex.: SP).'),
  areaHectares: z
    .string()
    .trim()
    .min(1, 'Informe a área em hectares.')
    .refine((value) => {
      const area = parseHectares(value);
      return area !== null && area > 0;
    }, 'Informe uma área maior que zero (ex.: 3,5).'),
  description: z.string().trim(),
});

/** Valores do formulário: todos são texto, convertidos só no envio. */
export type PropertyFormValues = z.infer<typeof propertySchema>;

export const emptyPropertyForm: PropertyFormValues = {
  name: '',
  city: '',
  state: '',
  areaHectares: '',
  description: '',
};

export function toFormValues(property: Property): PropertyFormValues {
  return {
    name: property.name,
    city: property.city,
    state: property.state,
    areaHectares: hectaresToInput(property.areaHectares),
    description: property.description ?? '',
  };
}

export function toPropertyInput(values: PropertyFormValues): PropertyInput {
  return {
    name: values.name.trim(),
    city: values.city.trim(),
    state: values.state.trim().toUpperCase(),
    areaHectares: parseHectares(values.areaHectares) ?? 0,
    description: values.description.trim() || null,
  };
}
