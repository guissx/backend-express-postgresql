import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/User";

// GET ALL USERS (ignora deletados)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      where: { isDeleted: false },
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

// GET USER BY ID (ignora deletados)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      where: { 
        id: req.params.id, 
        isDeleted: false 
      },
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};

// CREATE USER
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const validateEmail = (email: string): boolean => email.includes('@');

  const validatePassword = (password: string): boolean => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasLength = password.length >= 8;
    return hasUpper && hasLower && hasLength;
  };

  if (!validateEmail(email)) {
    res.status(400).json({ message: "Email inválido. Deve conter '@'" });
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).json({
      message: "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula e uma minúscula."
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email já está em uso" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ 
      where: { 
        id, 
        isDeleted: false 
      } 
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado ou deletado" });
      return;
    }

    // Atualiza campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({ 
      message: "Usuário atualizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

// SOFT DELETE USER
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ 
      where: { 
        id, 
        isDeleted: false 
      } 
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado ou já deletado" });
      return;
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({ message: "Usuário marcado como deletado" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};

// RESTORE USER
export const restoreUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ 
      where: { 
        id, 
        isDeleted: true 
      } 
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado ou não está deletado" });
      return;
    }

    user.isDeleted = false;
    await user.save();

    res.status(200).json({ message: "Usuário restaurado com sucesso" });
  } catch (error) {
    console.error("Erro ao restaurar usuário:", error);
    res.status(500).json({ message: "Erro ao restaurar usuário" });
  }
};