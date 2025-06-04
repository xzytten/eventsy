// Event Types
export const EVENT_TYPES = [
  'WEDDING',
  'BIRTHDAY',
  'CORPORATE',
  'CONFERENCE',
  'GRADUATION',
  'BAPTISM',
  'ANNIVERSARY',
  'BANQUET',
  'BUFFET',
  'ANY_EVENT'
] as const;

export type EventType = typeof EVENT_TYPES[number];

// Music Service Types
export const MUSIC_TYPES = [
  'DJ',
  'LIVE_BAND',
  'SOLO_ARTIST',
  'MUSIC_EQUIPMENT'
] as const;

export type MusicType = typeof MUSIC_TYPES[number];

// Food Types
export const FOOD_TYPES = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'BUFFET',
  'CANAPES',
  'DESSERTS',
  'INDIVIDUAL_DISHES',
  'FAST_FOOD'
] as const;

export type FoodType = typeof FOOD_TYPES[number];

// Beverage Types
export const BEVERAGE_TYPES = [
  'ALCOHOLIC',
  'NON_ALCOHOLIC',
  'HOT_DRINKS',
  'COCKTAILS',
  'PACKAGES'
] as const;

export type BeverageType = typeof BEVERAGE_TYPES[number];

// Vehicle Types
export const VEHICLE_TYPES = [
  'LUXURY_CAR',
  'LIMOUSINE',
  'BUS',
  'MINIVAN',
  'SPECIAL_EVENT_VEHICLE'
] as const;

export type VehicleType = typeof VEHICLE_TYPES[number];

// Display names for UI (Ukrainian)
export const EVENT_TYPE_NAMES: Record<EventType, string> = {
  WEDDING: 'Весілля',
  BIRTHDAY: 'День народження',
  CORPORATE: 'Корпоратив',
  CONFERENCE: 'Конференція',
  GRADUATION: 'Випускний',
  BAPTISM: 'Хрестини',
  ANNIVERSARY: 'Ювілей',
  BANQUET: 'Банкет',
  BUFFET: 'Фуршет',
  ANY_EVENT: 'Будь-який захід'
};

export const MUSIC_TYPE_NAMES: Record<MusicType, string> = {
  DJ: 'DJ',
  LIVE_BAND: 'Живий гурт',
  SOLO_ARTIST: 'Сольний виконавець',
  MUSIC_EQUIPMENT: 'Прокат обладнання'
};

export const FOOD_TYPE_NAMES: Record<FoodType, string> = {
  BREAKFAST: 'Сніданок',
  LUNCH: 'Обід',
  DINNER: 'Вечеря',
  BUFFET: 'Фуршет',
  CANAPES: 'Канопе',
  DESSERTS: 'Десерти',
  INDIVIDUAL_DISHES: 'Окремі страви',
  FAST_FOOD: 'Фастфуд'
};

export const BEVERAGE_TYPE_NAMES: Record<BeverageType, string> = {
  ALCOHOLIC: 'Алкогольні',
  NON_ALCOHOLIC: 'Безалкогольні',
  HOT_DRINKS: 'Гарячі напої',
  COCKTAILS: 'Коктейлі',
  PACKAGES: 'Набори'
};

export const VEHICLE_TYPE_NAMES: Record<VehicleType, string> = {
  LUXURY_CAR: 'Розкішний автомобіль',
  LIMOUSINE: 'Лімузин',
  BUS: 'Автобус',
  MINIVAN: 'Мінівен',
  SPECIAL_EVENT_VEHICLE: 'Спеціальний транспорт'
}; 