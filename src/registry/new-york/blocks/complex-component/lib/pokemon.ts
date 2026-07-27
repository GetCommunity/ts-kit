import * as v from "valibot";

const pokemonListSchema = v.object({
  results: v.array(v.object({ name: v.string() })),
});

const pokemonSchema = v.object({
  name: v.string(),
  id: v.number(),
  sprites: v.object({
    front_default: v.string(),
  }),
  stats: v.array(
    v.object({
      base_stat: v.number(),
      stat: v.object({
        name: v.string(),
      }),
    }),
  ),
});

export async function getPokemonList({ limit = 10 }: { limit?: number } = {}) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
    );
    return v.parse(pokemonListSchema, await response.json());
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPokemon(name: string) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (!response.ok) {
      throw new Error("Failed to fetch pokemon");
    }

    return v.parse(pokemonSchema, await response.json());
  } catch (error) {
    console.error(error);
    return null;
  }
}
