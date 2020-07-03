import { differenceInMinutes } from 'date-fns';
import { CartItem } from 'src/entity/CartItem';
export const getCartItemPrice = ({ numberOfPeople, lesson }: CartItem) => {
  const priceArr = [70000, 50000, 40000, 30000];
  const length = differenceInMinutes(lesson.end, lesson.start) / 60;
  return (priceArr[numberOfPeople - 1] || 70000) * numberOfPeople * length;
};
