import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  return res.json([
    {
      id: 1,
      title: 'Blog 1',
      content: 'Content of blog 1',
    },
    {
      id: 2,
      title: 'Blog 2',
      content: 'Content of blog 2',
    },
  ]);
};
