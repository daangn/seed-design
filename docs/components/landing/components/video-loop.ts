/** A large backward jump in a looping video's currentTime = a loop wrap (it's never seeked). */
export const didWrap = (prev: number, curr: number) => curr < prev - 0.25;
