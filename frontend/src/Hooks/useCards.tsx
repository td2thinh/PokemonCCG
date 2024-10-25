
const useCards = (id: string | undefined) => {
	// si c'est un owner tu peux renvoyer toute les carte
	// sinon tu renvoies les cartes de la collectionIds
	return {
		cards: [
			{
				id: 1,
				image: "https://images.pokemontcg.io/swsh4/1.png",
				name: "Charizard",
			},
			{
				id: 2,
				image: "https://images.pokemontcg.io/swsh4/2.png",
				name: "Pikachu",
			},
			{
				id: 3,
				image: "https://images.pokemontcg.io/swsh4/3.png",
				name: "Bulbasaur",
			},
			{
				id: 4,
				image: "https://images.pokemontcg.io/swsh4/4.png",
				name: "Squirtle",
			},
			{
				id: 5,
				image: "https://images.pokemontcg.io/swsh4/5.png",
				name: "Jigglypuff",
			},
			{
				id: 6,
				image: "https://images.pokemontcg.io/swsh4/6.png",
				name: "Meowth",
			},
			{
				id: 7,
				image: "https://images.pokemontcg.io/swsh4/7.png",
				name: "Psyduck",
			},
			{
				id: 8,
				image: "https://images.pokemontcg.io/swsh4/8.png",
				name: "Machop",
			},
			{
				id: 9,
				image: "https://images.pokemontcg.io/swsh4/9.png",
				name: "Magikarp",
			},
			{
				id: 10,
				image: "https://images.pokemontcg.io/swsh4/10.png",
				name: "Gengar",
			},
			{
				id: 11,
				image: "https://images.pokemontcg.io/swsh4/11.png",
				name: "Onix",
			},
			{
				id: 12,
				image: "https://images.pokemontcg.io/swsh4/12.png",
				name: "Snorlax",
			},
			{
				id: 13,
				image: "https://images.pokemontcg.io/swsh4/13.png",
				name: "Eevee",
			},
			{
				id: 14,
				image: "https://images.pokemontcg.io/swsh4/14.png",
				name: "Vulpix",
			},
			{
				id: 15,
				image: "https://images.pokemontcg.io/swsh4/15.png",
				name: "Geodude",
			},
			{
				id: 16,
				image: "https://images.pokemontcg.io/swsh4/16.png",
				name: "Rattata",
			},
			{
				id: 17,
				image: "https://images.pokemontcg.io/swsh4/17.png",
				name: "Zubat",
			},
			{
				id: 18,
				image: "https://images.pokemontcg.io/swsh4/18.png",
				name: "Oddish",
			},
			{
				id: 19,
				image: "https://images.pokemontcg.io/swsh4/19.png",
				name: "Poliwag",
			},
			{
				id: 20,
				image: "https://images.pokemontcg.io/swsh4/20.png",
				name: "Abra",
			},
		],
	};
};

export default useCards;