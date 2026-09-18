export interface IPasswordHasher {
  hashPasswordAsync(password: string): Promise<string>;
  verifyPasswordAsync(password: string, passwordHash: string): Promise<boolean>;
}

export class BcryptPasswordHasher implements IPasswordHasher {
  public async hashPasswordAsync(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 11
    });
  }
  
  public async verifyPasswordAsync(password: string, passwordHash: string): Promise<boolean> {
    return await Bun.password.verify(password, passwordHash);
  }
}
