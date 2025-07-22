import PocketBase from 'pocketbase';

// PocketBase client configuration
const getBackendUrl = (): string => {
  // Check for environment variable first
  const envUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (envUrl) {
    return envUrl;
  }

  // Default to production URL for both web and mobile
  return 'https://stringr.tux-sudo.com/';
};

const pb = new PocketBase(getBackendUrl());

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
  brand?: string;
  model: string;
  material?: string;
  gauge?: string;
  color?: string;
  user?: string;
  created: string;
  updated: string;
}

export interface Racquet {
  id: string;
  user?: string;
  brand?: string;
  model?: string;
  name: string; // Required field for racquet name
  pattern?: string; // String pattern (was string_pattern)
  weight?: string; // Weight as text field
  notes?: string;
  is_active?: boolean;
  year?: number;
  created: string;
  updated: string;
}

export interface StringJob {
  id: string;
  user?: string;
  racquet?: string;
  main_string?: string;
  cross_string?: string;
  tension_lbs_main?: number; // Main tension in lbs
  tension_lbs_cross?: number; // Cross tension in lbs
  created: string;
  updated: string;
}

export interface Session {
  id: string;
  user?: string;
  string_job?: string;
  duration_hours?: number;
  rating?: number;
  string_broken?: boolean;
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

export interface SessionWithRelations extends Session {
  expand?: {
    user?: User;
    string_job?: StringJob;
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
        sort: '-created',
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
        sort: '-created',
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

  // Sessions
  sessions: {
    list: async (page = 1, perPage = 30) => {
      return await pb.collection('sessions').getList<SessionWithRelations>(page, perPage, {
        sort: '-created',
        expand: 'user,string_job',
      });
    },

    getById: async (id: string) => {
      return await pb.collection('sessions').getOne<SessionWithRelations>(id, {
        expand: 'user,string_job',
      });
    },

    getByStringJob: async (stringJobId: string) => {
      return await pb.collection('sessions').getList<SessionWithRelations>(1, 50, {
        filter: `string_job = "${stringJobId}"`,
        sort: '-created',
        expand: 'user,string_job',
      });
    },

    create: async (data: Partial<Session>) => {
      return await pb.collection('sessions').create<Session>(data);
    },

    update: async (id: string, data: Partial<Session>) => {
      return await pb.collection('sessions').update<Session>(id, data);
    },

    delete: async (id: string) => {
      return await pb.collection('sessions').delete(id);
    },
  },
};