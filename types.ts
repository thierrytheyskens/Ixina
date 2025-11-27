

export enum PlantOption {
  NONE = 'Aucune',
  LITTLE = 'Un peu',
  LOT = 'Beaucoup'
}

export enum LightingOption {
  NO_CHANGE = 'Aucune modification',
  RECESSED = 'Éclairage encastré (Spots)',
  LAMPS = 'Lampes / Suspensions'
}

export enum ResolutionOption {
  LOW = 'Basse',
  MEDIUM = 'Moyenne',
  HIGH = 'Haute'
}

export enum KitchenFinish {
  AUTO = 'Naturel (Auto)',
  MATTE = 'Mat Profond',
  GLOSSY = 'Ultra Brillant'
}

export enum WoodTextureOption {
  STANDARD = 'Standard',
  ENHANCED = 'Renforcé (Brut)'
}

export enum DecorIntensity {
  MINIMAL = 'Minimaliste',
  BALANCED = 'Standard',
  MAXIMAL = 'Accentué (Vivant)'
}

export enum PerspectiveType {
  NATURAL = 'Naturelle',
  IMMERSIVE = 'Grand Angle (Immersif)'
}

export enum LightingAtmosphere {
  NEUTRAL = 'Neutre (Studio)',
  MORNING = 'Matinée (Lumière Fraîche)',
  GOLDEN_HOUR = 'Heure Dorée (Soleil)',
  COSY = 'Cosy (Cocooning)',
  EVENING = 'Soirée Chic (Tamisé)'
}

export enum FurnitureAddOption {
  NONE = 'Aucun',
  CHAIRS = 'Chaises (Table)',
  STOOLS = 'Tabourets (Ilot/Bar)'
}

export interface EnhancementOptions {
  plants: PlantOption;
  wallDecor: boolean;
  utensils: boolean;
  fruit: boolean;
  lighting: LightingOption;
  lightingIntensity: number; // 0 to 100
  resolution: ResolutionOption;
  raytracing: boolean;
  addWindowView: boolean;
  kitchenFinish: KitchenFinish;
  woodTexture: WoodTextureOption;
  enhanceFramedDoors: boolean;
  highFidelityDetails: boolean;
  hyperRealism: boolean;
  allowWallModification: boolean;
  allowFloorModification: boolean;
  addWalls: boolean;
  decorIntensity: DecorIntensity;
  perspectiveType: PerspectiveType;
  lightingAtmosphere: LightingAtmosphere;
  furnitureAdd: FurnitureAddOption;
}

export interface GeneratedResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}