const blacklist = new Set<string>();

export const blacklistService = {
  blacklistToken(token: string) {
    blacklist.add(token);
  },

  isTokenBlacklisted(token: string): boolean {
    return blacklist.has(token);
  },
};
