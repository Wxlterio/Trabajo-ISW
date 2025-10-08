import { loginUser } from "../services/auth.service.js";
import { createUser } from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { userValidation } from "../validations/user.validation.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { error } = userValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }
    
    const data = await loginUser(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

export async function register(req, res) {
  try {
    const data = req.body;

    const { error } = userValidation.validate(data);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }
    
    const newUser = await createUser(data);
    delete newUser.password;
    handleSuccess(res, 201, "Usuario registrado exitosamente", newUser);
  } catch (error) {
    if (error.code) { 
      handleErrorClient(res, 409, "El email ya esta registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}
