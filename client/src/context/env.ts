interface Env {
  VITE_CLERK_PUBLISHABLE_KEY: string;
}

const env: Env = {
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};

export default env;