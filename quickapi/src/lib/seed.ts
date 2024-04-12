import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})


const animeList = [
    "Attack on Titan",
    "Bleach",
    "Code Geass",
    "Death Note",
    "Dragon Ball",
    "Evangelion",
    "Fairy Tail",
    "Fullmetal Alchemist",
    "Ghost in the Shell",
    "Hunter x Hunter",
    "Inuyasha",
    "JoJo's Bizarre Adventure",
    "Kill la Kill",
    "Love Live!",
    "My Hero Academia",
    "Naruto",
    "One Piece",
    "Demon Slayer",
    "Pokemon",
    "Queen's Blade",
    "Re:Zero",
    "Sailor Moon",
    "Tokyo Ghoul",
    "Uzumaki",
    "Vinland Saga",
    "Wolf's Rain",
    "X",
    "High School DXD",
    "Yu Yu Hakusho",
    "Zankyou no Terror",
    "Afro Samurai",
    "Baccano!",
    "Cowboy Bebop",
    "D.Gray-man",
    "Elfen Lied",
    "Fruits Basket",
    "Gintama",
    "Hellsing",
    "Inazuma Eleven",
    "Jujutsu Kaisen",
    "K-On!",
    "Log Horizon",
    "Mob Psycho 100",
    "Nanatsu no Taizai",
    "Overlord",
    "Psycho-Pass",
    "Rurouni Kenshin",
    "Steins;Gate",
    "Toradora!",
    "Umineko no Naku Koro ni",
    "Violet Evergarden",
    "Witch Hunter Robin",
    "Yuri!!! on Ice",
    "Zoids",
    "Solo Leveling",
    "Tokyo Revengers",
    "Tokyo Ghoul",
];


// Algo to populate Redis with 2 terms for each anime name
//for efficient storage and retrieval in a database, for search functionality.
animeList.forEach((anime) => {
    const term = anime.toUpperCase()
    const terms: { score: 0; member: string }[] = []
  
    for (let i = 0; i <= term.length; i++) {
      terms.push({ score: 0, member: term.substring(0, i) })
    }
    terms.push({ score: 0, member: term + '*' })
  
    const populateDb = async () => {
      // @ts-expect-error
      await redis.zadd('terms', ...terms)
    }
  
    populateDb()
  })