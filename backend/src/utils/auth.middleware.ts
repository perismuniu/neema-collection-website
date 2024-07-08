import { Request, Response, NextFunction } from 'express';
import passport from './auth.strategy';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    // If user is authenticated via session, proceed
    return next();
  }

  // If not authenticated via session, try JWT authentication
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.status(401).json({ message: info?.message || 'Unauthorized' });
    }
    req.user = user;
    console.log('User authenticated via JWT');
    next();
  })(req, res, next);
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  req.user.isAdmin ? next() : res.status(403).json({ message: 'You are not allowed to perform this action' });
};