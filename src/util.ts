export const wait = (milli: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milli);
  });

export const waitUntil = async (
  fn: () => boolean,
  maxMilli: number = 1000,
): Promise<void> => {
  if (maxMilli <= 0) {
    throw new Error("waitUntil exceeded maxMilli");
  }
  if (fn()) {
    return Promise.resolve();
  } else {
    await wait(10);
    return waitUntil(fn, maxMilli - 10);
  }
};
