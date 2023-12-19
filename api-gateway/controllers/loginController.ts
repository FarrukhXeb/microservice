import { Request, Response } from 'express';
import { login } from '../services/auth-service';

export default async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await login(email, password);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
