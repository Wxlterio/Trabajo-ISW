import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function findUserById(id) {
  return await userRepository.findOneBy({ id });
}

export async function updateUser(id, data) {
  const user = await userRepository.findOneBy({ id });
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await userRepository.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error("El email ya está en uso por otro usuario");
    }
  }
  
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      user[key] = data[key];
    }
  });

  return await userRepository.save(user);
}

export async function deleteUser(id) {
  const user = await userRepository.findOneBy({ id });
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  await userRepository.remove(user);
  return { message: "Usuario eliminado exitosamente" };
}
