import { Request } from 'express';
import Stripe from 'stripe';
export interface MyContext {
  req: Request;
  userId?: string | null;
  stripe: Stripe;
  // userLoader: DataLoader<string, User>;
}
