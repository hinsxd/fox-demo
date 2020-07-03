import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const findOrCreateUser = async ({
  email,
  fbProviderId,
  googleProviderId
}: {
  email: string;
  fbProviderId?: string;
  googleProviderId?: string;
}): Promise<User | undefined> => {
  if (!fbProviderId && !googleProviderId) {
    throw new Error('No Providers');
  }

  try {
    const user = await getRepository(User).findOneOrFail({ email });
    if (fbProviderId) {
      if (!user.fbProviderId) {
        await getRepository(User).update({ id: user.id }, { fbProviderId });
      }
      if (user.fbProviderId !== fbProviderId) {
        throw new Error('Record does not match');
      }
    }
    if (googleProviderId) {
      if (!user.googleProviderId) {
        await getRepository(User).update({ id: user.id }, { googleProviderId });
      }
      if (user.googleProviderId !== googleProviderId) {
        throw new Error('Record does not match');
      }
    }
    return getRepository(User).findOne({ email });
  } catch (e) {
    return getRepository(User).save({
      email,
      fbProviderId,
      googleProviderId
    });
  }
};
