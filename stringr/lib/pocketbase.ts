import PocketBase from 'pocketbase';

// PocketBase client configuration
const pb = new PocketBase('http://localhost:8090');

// Enable auto cancellation for duplicated requests
pb.autoCancellation(false);

export default pb;

// Type definitions for our collections
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
}

export interface String {
  id: string;
  brand: string;
  model: string;
  material: 'Polyester' | 'Natural Gut' | 'Synthetic Gut' | 'Multifilament' | 'Hybrid';
  gauge?: string;
  color?: string;
  characteristics?: {
    power?: number;
    control?: number;
    spin?: number;
    comfort?: number;
    durability?: number;
  };
  price_per_set?: number;
  notes?: string;
  created: string;
  updated: string;
}

export interface Racquet {
  id: string;
  user: string;
  brand: string;
  model: string;
  year?: number;
  grip_size?: string;
  string_pattern?: string;
  weight_unstrung?: number;
  weight_strung?: number;
  balance_point?: number;
  swing_weight?: number;
  photo?: string;
  notes?: string;
  is_active: boolean;
  created: string;
  updated: string;
}

export interface StringJob {
  id: string;
  user: string;
  racquet: string;
  main_string: string;
  cross_string?: string;
  main_tension: number;
  cross_tension?: number;
  tension_unit: 'lbs' | 'kg';
  stringer_name?: string;
  string_date: string;
  string_cost?: number;
  pre_stretch: boolean;
  notes?: string;
  performance_rating?: number;
  durability_hours?: number;
  broke_at?: string;
  created: string;
  updated: string;
}

// Expanded types with relations
export interface RacquetWithRelations extends Racquet {
  expand?: {
    user?: User;
  };
}

export interface StringJobWithRelations extends StringJob {
  expand?: {
    user?: User;
    racquet?: Racquet;
    main_string?: String;
    cross_string?: String;
  };
}

// API helper functions
export const auth = {
  // Login with email and password
  login: async (email: string, password: string) => {
    return await pb.collection('users').authWithPassword(email, password);
  },

  // Register new user
  register: async (email: string, password: string, passwordConfirm: string, name?: string) => {
    const data = {
      email,
      password,
      passwordConfirm,
      name: name || '',
    };
    return await pb.collection('users').create(data);
  },

  // Logout
  logout: () => {
    pb.authStore.clear();
  },

  // Get current user
  getCurrentUser: () => {
    return pb.authStore.model as User | null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return pb.authStore.isValid;
  },
};

export const api = {
  // Racquets
  racquets: {
    list: async (page = 1, perPage = 30) => {
      return await pb.collection('racquets').getList<RacquetWithRelations>(page, perPage, {
        sort: '-created',
        expand: 'user',
      });
    },

    getById: async (id: string) => {
      return await pb.collection('racquets').getOne<RacquetWithRelations>(id, {
        expand: 'user',
      });
    },

    create: async (data: Partial<Racquet>) => {
      return await pb.collection('racquets').create<Racquet>(data);
    },

    update: async (id: string, data: Partial<Racquet>) => {
      return await pb.collection('racquets').update<Racquet>(id, data);
    },

    delete: async (id: string) => {
      return await pb.collection('racquets').delete(id);
    },
  },

  // Strings
  strings: {
    list: async (page = 1, perPage = 50) => {
      return await pb.collection('strings').getList<String>(page, perPage, {
        sort: 'brand,model',
      });
    },

    getById: async (id: string) => {
      return await pb.collection('strings').getOne<String>(id);
    },

    create: async (data: Partial<String>) => {
      return await pb.collection('strings').create<String>(data);
    },

    update: async (id: string, data: Partial<String>) => {
      return await pb.collection('strings').update<String>(id, data);
    },

    delete: async (id: string) => {
      return await pb.collection('strings').delete(id);
    },

    search: async (query: string) => {
      return await pb.collection('strings').getList<String>(1, 50, {
        filter: `brand ~ "${query}" || model ~ "${query}"`,
        sort: 'brand,model',
      });
    },
  },

  // String Jobs
  stringJobs: {
    list: async (page = 1, perPage = 30) => {
      return await pb.collection('string_jobs').getList<StringJobWithRelations>(page, perPage, {
        sort: '-string_date',
        expand: 'user,racquet,main_string,cross_string',
      });
    },

    getById: async (id: string) => {
      return await pb.collection('string_jobs').getOne<StringJobWithRelations>(id, {
        expand: 'user,racquet,main_string,cross_string',
      });
    },

    getByRacquet: async (racquetId: string) => {
      return await pb.collection('string_jobs').getList<StringJobWithRelations>(1, 50, {
        filter: `racquet = "${racquetId}"`,
        sort: '-string_date',
        expand: 'user,racquet,main_string,cross_string',
      });
    },

    create: async (data: Partial<StringJob>) => {
      return await pb.collection('string_jobs').create<StringJob>(data);
    },

    update: async (id: string, data: Partial<StringJob>) => {
      return await pb.collection('string_jobs').update<StringJob>(id, data);
    },

    delete: async (id: string) => {
      return await pb.collection('string_jobs').delete(id);
    },
  },
};