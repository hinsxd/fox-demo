export const centsToDollarString = (cents: number) =>
  `$${(cents / 100).toFixed(2)}`;
