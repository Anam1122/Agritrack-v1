export const auth = async () => {
  // UNCOMMENT untuk bypass auth:
  return {
    principal: "mock-principal-123",
    isAuthenticated: true
  };
  
  // COMMENT kode Internet Identity:
  // const client = await initAuth();
  // const isAuthenticated = await client.isAuthenticated();
  // ...
};

export const login = async () => {
  // UNCOMMENT untuk bypass auth:
  return {
    principal: "mock-principal-123", 
    isAuthenticated: true
  };
  
  // COMMENT kode Internet Identity:
  // const client = await initAuth();
  // ...
};

export const logout = async () => {
  // UNCOMMENT untuk bypass auth:
  console.log("Mock logout");
  
  // COMMENT kode Internet Identity:
  // const client = await initAuth();
  // await client.logout();
};