/* import { useDBClient } from "@/server/db/client"
import { useGeneratedData } from "~/server/db/mock/generate";
import * as schema from '~/server/db/schema';

export default defineEventHandler(async () => {
    const db = useDBClient()

    await db.delete(schema.colors).execute();
    await db.delete(schema.sizes).execute();
    await db.delete(schema.models).execute();
    await db.delete(schema.brands).execute();
    await db.delete(schema.colorsOfModels).execute();
    await db.delete(schema.sizesOfModels).execute();

    const generatedData = await useGeneratedData();

    const storedBrands = await db.insert(schema.brands).values(generatedData.brands).returning().all();

    const storedColors = await db.insert(schema.colors).values(generatedData.colors).returning().all();

    const mappedModelsToBrands = generatedData.mapModelsToBrands(storedBrands);
    const storedModels = await db.insert(schema.models).values(mappedModelsToBrands).returning().all();

    const storedSizes = await db.insert(schema.sizes).values(generatedData.sizes).returning().all();

    const mappedColorsToModels = generatedData.mapColorsToModels(storedModels, storedColors);
    await db.insert(schema.colorsOfModels).values(mappedColorsToModels).execute();

    const mappedSizesToModels = generatedData.mapSizesToModels(storedModels, storedSizes);
    await db.insert(schema.sizesOfModels).values(mappedSizesToModels).execute();

    return {
        brands: storedBrands,
        colors: storedColors,
        models: storedModels,
        sizes: storedSizes
    }
})
 */
