export type TeamAvailabilityParams = {
  team_name: string;
  alias: string;
};

export type Element = {
  id: string;
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    zIndex: number;
  };
  icon: {
    id: string;
    filename: string;
    category: string;
    premium: boolean;
  };
};

export interface Transform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}