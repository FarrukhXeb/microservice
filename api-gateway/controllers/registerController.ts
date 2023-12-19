import { Request, Response } from 'express';
import { register } from '../services/auth-service';

export default async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await register(email, password);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
