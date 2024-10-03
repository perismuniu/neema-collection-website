import { Request, Response, NextFunction } from 'express';
import passport from './auth.strategy';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(['jwt', 'local'], { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'You are not allowed to perform this action' });
  }
};