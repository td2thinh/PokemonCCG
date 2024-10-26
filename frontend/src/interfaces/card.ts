export interface PokemonCard {
  name: string
  id: string
  image: string
  text: string
}

export interface BoosterPack {
  name: string
  id: number
  collectionId: number
  image: string
  cardCount: number
  price: string
  pokemonIds: string[]
}
