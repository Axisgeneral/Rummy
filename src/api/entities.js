// Mock implementations to replace Base44 SDK
// Game now uses localStorage instead of external API

export const GameState = {
  filter: () => Promise.resolve([]),
  create: () => Promise.resolve({}),
  update: () => Promise.resolve({})
};

export const User = {
  me: () => Promise.resolve({ email: 'local@player.com' })
};