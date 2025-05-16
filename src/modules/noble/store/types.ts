export interface INobleStore {
  noble: {
    id: string;
    rank: string;
    achievements: {
      completed: Set<string>;
      total: number;
      categories: Record<string, number>;
    };
    resources: {
      gold: number;
      influence: number;
    };
    stats: {
      territoriesOwned: number;
    };
  } | null;
  isLoading: boolean;
  error: string | null;
  setNoble: (noble: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface NobleStorePersist {
  noble: {
    id: string;
    rank: string;
    achievements: {
      completed: string[];
      total: number;
      categories: Record<string, number>;
    };
    resources: {
      gold: number;
      influence: number;
    };
    stats: {
      territoriesOwned: number;
    };
  } | null;
}