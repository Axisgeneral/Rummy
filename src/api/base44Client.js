// Mock Base44 client - no longer using external API
// Game now runs entirely locally with localStorage

export const base44 = {
  entities: {
    GameState: {
      filter: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({})
    }
  },
  auth: {
    me: () => Promise.resolve({ email: 'local@player.com' })
  }
};
