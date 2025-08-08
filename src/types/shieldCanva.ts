export type PatternConfig = {
    rotation: number;
    scale: number;
    density: number;
    elementSize: number;
    primaryColor: string;
    secondaryColor: string;
};

export type StrokeConfig = {
    enabled: boolean;
    color: string;
    width: number;
};
export type Element = {
    id: string;
    transform: {
        xPercent: number;
        yPercent: number;
        scaleRel: number;
        rotation: number;
        zIndex: number;
        flipX?: number;
    };
    icon: {
        id: string;
        filename: string;
        category: string;
        premium: boolean;
    };
};
