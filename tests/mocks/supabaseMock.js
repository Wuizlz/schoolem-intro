import { jest } from "@jest/globals";

export function createSupabaseMock() {
  return {
    auth: {
      signUp: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      setSession: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      updateUser: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
    rpc: jest.fn(),
  };
}
