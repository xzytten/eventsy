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

export const VEHICLE_TYPE_NAMES = {
  LUXURY_CAR: 'Розкішний автомобіль',
  LIMOUSINE: 'Лімузин',
  BUS: 'Автобус',
  MINIVAN: 'Мінівен',
  SPECIAL_EVENT_VEHICLE: 'Спеціальний транспорт'
} as const; 