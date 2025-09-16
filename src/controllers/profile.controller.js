import { handleSuccess, handleErrorServer, handleErrorClient } from "../Handlers/responseHandlers.js";
import { updateUser, deleteUser, findUserById } from "../services/user.service.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "Hola, Este es un perfil publico.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `Hola, ${user.email} Este es tu perfil privado.`,
    userData: user,
  });
}

export async function updatePrivateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    
    if (!email && !password) {
      return handleErrorClient(res, 400, "Debe proporcionar al menos un campo para actualizar (email o password)");
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return handleErrorClient(res, 400, "El formato del email no es valido");
      }
    }

    if (password && password.length < 6) {
      return handleErrorClient(res, 400, "La contraseña debe tener al menos 6 caracteres");
    }

    const updatedUser = await updateUser(userId, { email, password });

    const { password: _, ...userWithoutPassword } = updatedUser;

    handleSuccess(res, 200, "Perfil actualizado exitosamente", {
      user: userWithoutPassword
    });

  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    if (error.message === "El email ya esta en uso por otro usuario") {
      return handleErrorClient(res, 409, "El email ya esta en uso por otro usuario");
    }
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function deletePrivateProfile(req, res) {
  try {
    const userId = req.user.id;

    await deleteUser(userId);

    handleSuccess(res, 200, "Cuenta eliminada exitosamente", {
      message: "Tu cuenta ha sido eliminada permanentemente"
    });

  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}
