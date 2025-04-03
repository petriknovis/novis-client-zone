export type User = {
  email: string;
  password: string;
  name: string;
  id: string;
};

export const users: User[] = [
  {
    email: "admin@example.com",
    password: "admin",
    name: "Administrator",
    id: "1"
  }
];

export const findUser = (email: string, password: string): User | undefined => {
  return users.find(user => user.email === email && user.password === password);
};
