
export const SPACING = 1.5

/*
s = spacing
dx -s   0  +s  dy    
 
    0 | 1 | 2  +s
   -----------
    3 | 4 | 5   0
   -----------
    6 | 7 | 8  -s
*/
export function indexToOffset(i) {
  let dx = ([0, 3, 6].includes(i) ? -SPACING
    : ([2, 5, 8].includes(i) ? SPACING : 0))
  let dy = ([0, 1, 2].includes(i) ? SPACING
    : ([6, 7, 8].includes(i) ? -SPACING : 0))
  return { dx, dy }
}