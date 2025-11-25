export type Food = {
    id: number;
    name: string;
    ownerId: number | null;
    calories?: number;
    protein?: number;
    fat?: number;
    carbohydrates?: number;
    imageId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    externalId?: string | null;
};