"use strict"
import joi from "joi";

export const userValidation = joi.object({

  email: joi.string()
    .required()
    .email()
    .messages({
      "string.email": "El correo electronico es invalido",
      "string.empty": "El correo electronico no puede esta vacio",
      "any.required": "El correo electronico es obligatorio",
    }),

  password: joi.string()
    .required()
    .min(8)
    .max(16)
    .pattern(/^[a-zA-Z0-9]+$/)
    .invalid('password', 'contraseña', '12345678', 'administrador')
    .messages({
      "string.empty": "La contraseña no puede estar vacia",
      "any.required": "La contraseña es obligatoria",
      "string.min": "La contraseña debe tener almenos 8 caracteres",
      "string.max": "La contraseña puede contener como maximo 16 caracteres",
      "any.invalid": "La contraseña no puede ser ninguno de estos ejemplos: password, contraseña, 12345678, administrador",
    }),
})
.unknown(false)
.messages({
  "object.unknown": "Solo se permiten los campos: email y password",
});

export const updateUserValidation = joi.object({
  email: joi.string()
    .email()
    .messages({
      "string.email": "El correo electronico es invalido",
      "string.empty": "El correo electronico no puede esta vacio",
    }),

  password: joi.string()
    .min(8)
    .max(16)
    .pattern(/^[a-zA-Z0-9]+$/)
    .invalid('password', 'contraseña', '12345678', 'administrador')
    .messages({
      "string.empty": "La contraseña no puede estar vacia",
      "string.min": "La contraseña debe tener almenos 8 caracteres",
      "string.max": "La contraseña puede contener como maximo 16 caracteres",
      "any.invalid": "La contraseña no puede ser ninguno de estos ejemplos: password, contraseña, 12345678, administrador",
      "string.base": "La contraseña tiene que ser de tipo texto"
    }),
}).min(1)
.unknown(false)
.messages({
  "object.unknown": "Solo se permiten los campos: email y password",
  "object.min": "Debe proporcionar al menos un campo para actualizar (Correo electronico o Contraseña)"
});