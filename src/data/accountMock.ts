export const demoAccount = {
  email: "demo@gmail.com",
  password: "123",
  name: "Demo User",
};

export function validateCredentials(email: string, password: string) {
  return email === demoAccount.email && password === demoAccount.password;
}
