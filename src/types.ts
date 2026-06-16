export interface Post {
  id: string;
  name: string;
  content: string;
  timestamp: number;
}

export interface Topping {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface IceCreamCombo {
  id: string;
  toppingIds: [string, string]; // sorted lexicographically
  toppings: [Topping, Topping];
  found: boolean;
  timestamp?: number;
}

export interface PermutationCard {
  id: string;
  letters: [string, string, string];
  basketId: string; // which combination group it belongs to
}

export interface Basket {
  id: string;
  letters: string[]; // 3 unique letters sorted alphabetically
  label: string; // e.g. {A, B, C}
  permutations: string[][]; // 3! = 6 permutations
}
