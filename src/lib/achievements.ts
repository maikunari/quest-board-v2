export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'starter' | 'consistency' | 'volume' | 'special'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

export const ACHIEVEMENTS: Achievement[] = [
  // Starter
  { id: 'first_quest', name: 'First Blood', description: 'Complete your first quest', icon: '🗡️', category: 'starter', rarity: 'common' },
  { id: 'level_5', name: 'Apprentice', description: 'Reach level 5', icon: '📖', category: 'starter', rarity: 'common' },
  { id: 'level_10', name: 'Journeyman', description: 'Reach level 10', icon: '⚔️', category: 'starter', rarity: 'uncommon' },
  { id: 'level_25', name: 'Veteran', description: 'Reach level 25', icon: '🛡️', category: 'starter', rarity: 'rare' },
  { id: 'level_50', name: 'Legend', description: 'Reach level 50', icon: '👑', category: 'starter', rarity: 'legendary' },
  { id: 'first_integration', name: 'Connected', description: 'Set up your first integration', icon: '🔗', category: 'starter', rarity: 'common' },

  // Consistency
  { id: 'streak_3', name: 'Getting Started', description: '3-day streak', icon: '🔥', category: 'consistency', rarity: 'common' },
  { id: 'streak_7', name: 'On Fire', description: '7-day streak', icon: '🔥', category: 'consistency', rarity: 'uncommon' },
  { id: 'streak_14', name: 'Unstoppable', description: '14-day streak', icon: '💥', category: 'consistency', rarity: 'rare' },
  { id: 'streak_30', name: 'Iron Will', description: '30-day streak', icon: '⛓️', category: 'consistency', rarity: 'epic' },
  { id: 'streak_100', name: 'Immortal', description: '100-day streak', icon: '💀', category: 'consistency', rarity: 'legendary' },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all quests for 7 consecutive days', icon: '⭐', category: 'consistency', rarity: 'rare' },

  // Volume
  { id: 'quests_10', name: 'Adventurer', description: 'Complete 10 quests', icon: '🎯', category: 'volume', rarity: 'common' },
  { id: 'quests_50', name: 'Slayer', description: 'Complete 50 quests', icon: '💪', category: 'volume', rarity: 'uncommon' },
  { id: 'quests_100', name: 'Centurion', description: 'Complete 100 quests', icon: '🏛️', category: 'volume', rarity: 'rare' },
  { id: 'quests_500', name: 'Warlord', description: 'Complete 500 quests', icon: '⚔️', category: 'volume', rarity: 'epic' },
  { id: 'quests_1000', name: 'Godslayer', description: 'Complete 1,000 quests', icon: '🌟', category: 'volume', rarity: 'legendary' },
  { id: 'points_1000', name: 'Treasure Hunter', description: 'Earn 1,000 total points', icon: '💰', category: 'volume', rarity: 'uncommon' },
  { id: 'points_10000', name: 'Dragon Hoard', description: 'Earn 10,000 total points', icon: '🐉', category: 'volume', rarity: 'epic' },

  // Special
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a quest after midnight', icon: '🦉', category: 'special', rarity: 'uncommon' },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a quest before 6am', icon: '🐦', category: 'special', rarity: 'uncommon' },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Complete quests on Saturday and Sunday', icon: '🏋️', category: 'special', rarity: 'rare' },
  { id: 'clean_sweep', name: 'Clean Sweep', description: 'Complete all quests in a single day', icon: '🧹', category: 'special', rarity: 'rare' },
]

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
) as Record<string, Achievement>

export const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-500 text-gray-400',
  uncommon: 'border-green-500 text-green-400',
  rare: 'border-blue-500 text-blue-400',
  epic: 'border-purple-500 text-purple-400',
  legendary: 'border-yellow-500 text-yellow-400',
}

export const RARITY_BG: Record<string, string> = {
  common: 'bg-gray-500/10',
  uncommon: 'bg-green-500/10',
  rare: 'bg-blue-500/10',
  epic: 'bg-purple-500/10',
  legendary: 'bg-yellow-500/10',
}
