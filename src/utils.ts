/** Rounds input number up to two decimal places */
export function roundToHundredth(num: number) {
    return Math.ceil(num * 100) / 100;
}

/** rounds to neatest whole number rounded up */
export function roundToNearest(x: number) {
  return Math.ceil(x);
}

/**
 * Sleeps for the given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}
