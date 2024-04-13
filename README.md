# Building an High-Performance API with Next.js, Hono, and Cloudflare Workers
In today's digital landscape, speed is paramount. Whether it's delivering content, processing requests, or handling data, users expect lightning-fast responses. In this project, we're diving deep into building an ultra-high-performance API leveraging the power of Next.js, Hono, and Cloudflare Workers. 

## Introduction

This project stems from the idea of pushing the boundaries of API performance. The goal is to create an API that not only delivers results swiftly but also maintains low latency across the globe.

## Tools Used

### Next.js

Next.js provides a robust foundation for building web applications with React. Its server-side rendering capabilities and streamlined development process make it an excellent choice for our API's backend.

### Hono

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9kpd6fd4f59mgw7c9mfa.png)


[Hono](https://hono.dev), a powerful framework, is our secret sauce for crafting high-performance APIs. With its intuitive syntax and seamless integration with Next.js, Hono simplifies the process of optimizing API performance.

### Serverless Redis API with Upstash

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5l48pke2ny87w86dewln.png)

### Cloudflare Workers


![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m56dxuxkhxqonietv8nu.png)


[Cloudflare Workers](https://dash.cloudflare.com/) revolutionized the way we deploy and manage our API. By leveraging Cloudflare's global network, we can distribute our API across multiple locations, ensuring minimal latency for users worldwide.

## Project Overview

### Quick Api: A High-Performance API

Our project, aptly named QuickAPI, demonstrates the capabilities of our ultra-fast API. Users can input queries and receive results in milliseconds, thanks to our optimized infrastructure.

#### Example Usage

Let's say we want to search for information on countries. We type in our query, such as "Germany," and voila! In just 11 milliseconds, we get our results. The speed and efficiency are unparalleled.

### Architecture

#### Traditional Setup vs. Optimized Infrastructure

We delve into the architectural differences between conventional API setups and our optimized infrastructure.

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oiukwbfewigerfsoepqn.png)


**In the traditional approach** to serving user requests, the journey begins with the user initiating an action, be it clicking a link, submitting a form, or making an API call.

Once this request hits the server infrastructure, often hosted on platforms like AWS (Amazon Web Services), it's like throwing a pebble into a pond, setting off a ripple effect of data retrieval and processing. The server, acting as the intermediary, directs the request to the appropriate destination, typically a relational database like PostgreSQL or MySQL, where the requested information resides. Here, the database springs into action, executing queries and fetching records to fulfill the user's request.

Once the data is gathered, it embarks on a return journey, traveling back through the server infrastructure, navigating the network pathways until it reaches its final destination: the user's device. Finally, the user receives the response, whether it's a webpage loading, data being displayed, or some other interaction, completing the loop of user-server-database interaction.

While this traditional workflow served its purpose, it often resulted in slower response times and increased latency, especially for users geographically distant from the server infrastructure.

By distributing our database replicas and function instances globally, we minimize data transfer distances, resulting in superior performance.

**Optimized Approach -**

Instead of relying solely on a single server infrastructure, the modern approach leverages a combination of cutting-edge technologies to supercharge the process.

Firstly, Cloudflare Workers play a key role in the modern setup. **These distributed compute nodes are strategically positioned around the globe, ensuring that API endpoints are located close to users regardless of their geographic location. When a user makes a request, it's like flipping a switch in a network of interconnected servers, instantly routing the request to the nearest Cloudflare Worker.**


![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ps6e2brcpg6lk3iwurmr.png)

Just like in the image above... (CF - Cloudflare)

Also, we have Redis, the speed demon of search engine backends. **Redis serves as the backbone of our data retrieval process, providing lightning-fast access to information.** Unlike traditional databases, which may suffer from latency issues, Redis excels at rapid data retrieval, making it ideal for serving up quick search results and other dynamic content.

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r5msdkm72y8m7fn5c4j5.png)


Hono steps in as the **framework for API development**, offering tools and features optimized for performance. Designed with Next.js in mind, Hono streamlines the API development process, ensuring that code runs smoothly and efficiently under any workload.

And let's not forget about global database replication. By spreading our database instances (hello, Redis!) across multiple regions worldwide, we ensure that data is readily available near users, eliminating the need for data to travel long distances. This distributed setup minimizes latency and ensures that users experience fast and responsive interactions regardless of their location.

#### Database Performance Comparison

I conduct tests to compare the performance of different database engines, such as PostgreSQL and Redis. The results highlight the significant speed enhancements achieved with Redis and our optimized setup.

### PROJECT WORKAROUND
Project: [Github/QuickAPI](https://github.com/aadarsh-nagrath/QuickAPI)

Deployed Link: [QuickAPI](quickapi99.vercel.app)

Start with create-next@latest
For components, I used [Shadcn](https://ui.shadcn.com/docs/components/accordion) UI library. 
Initially created a useEffect for fetching or calling Api - 

```
  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);
      const res = await fetch(`/api/search?q=${input}`);
      const data = (await res.json()) as { results: string[]; duration: number };
      setSearchResults(data);
    };
    fetchData();
  }, [input]);
```

And build a simple Search [command](https://ui.shadcn.com/docs/components/command) box that takes in a query parameter and calls API at -
`api/search?q=`

This is how it looks - 

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3nyeyo7ztcsj6gco34ug.png)

Now go to [Upstash](https://upstash.com) or any other provider, to get started with Redis serverless database.

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/83moq3f938vhekl0244w.png)
Create a Database
![redis-db-creation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sn4llm31he12ydajfrq8.png)

Get the necessary tokens and urls and store them in `.env` -

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x3jg1t68ehf13b28utc2.png)

Now in lib directory preferably, create a file, name it whatever.
whatever.ts -

```
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
const animeList = [
    "Attack on Titan",
    "Code Geass",
    "Death Note",
    "Ghost in the Shell",
    "Hunter x Hunter",
    "My Hero Academia",
    "Naruto",
    "One Piece",
    "Demon Slayer",
.............etc,etc...
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
```
Now this file needs to be send to Redis DB, so `npx tsx src/lib/whatever.ts`
This sends this Searching Data and algo to Redis DB. Can be viewd in **Data Browser section** of Redis - 

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fr2dtpu0zzfx7re8rwk5.png)

Now Importantly in api/[[...routes]]/route.ts -
I created a get req, below is the following code with comments explanation - 

```
//Hono - Ultrafast web framework for the Edges
import { Redis } from '@upstash/redis/cloudflare'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

//env config
type EnvConfig = {
    UPSTASH_REDIS_REST_TOKEN: string
    UPSTASH_REDIS_REST_URL: string
}

app.get('/search', async (c) => {
    try {
        const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = env<EnvConfig>(c)

        const start = performance.now()
        //-------------------------------------------------
        const redis = new Redis({
            token: UPSTASH_REDIS_REST_TOKEN,
            url: UPSTASH_REDIS_REST_URL,
        })
    // now we have access to our database on the back end the redis instance
    
        const query = c.req.query('q')?.toString().toUpperCase(); // uppercase since data stored was in uppercase
        if (!query) {
            return c.json({ message: 'Invalid search query' }, { status: 400 })
        }
    
        const res = []
        const rank = await redis.zrank('terms', query)
        // term is ZSET in Redis, and send in query -> so this gives us the rank of the query in the sorted set (terms)
    
        if (rank !== null && rank !== undefined) {
          const temp = await redis.zrange<string[]>('terms', rank, rank + 300)
    
          for (const el of temp) {
            if (!el.startsWith(query)) {
              break
            }
    
            if (el.endsWith('*')) {
              res.push(el.substring(0, el.length - 1))
            }
            //If star * reached then end of the search, element found/ string complete
          }
        }
        //-------------------------------------------------
        const end = performance.now()
        // These performance.now will tell us how much time it took to execute the code - from start to end
        return c.json({
            results: res,
            duration: end - start, // in milliseconds - Time taken
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return c.json({ message: error.message }, { status: 500 });
        } else {
            return c.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
})

// This is the setup for or high performance API it doesn't use the regular nextjs syntax
// however we can make this actually compatible with the basic nextjs syntax so we get the performance benefits of
// deploying this to Cloud flare but also the compatibility benefits of deploying this to vercel if we want it to and doing that is one line of code

export const GET = handle(app)

export default app as never
// as never: This is a TypeScript type assertion. It essentially tells the TypeScript compiler to treat the app as a value that can never be assigned or used. 
// This is useful when you want to use an app as a value that can never be assigned or used.
```
#### More Explanation of code
**Let me break down what it does:**

1. It extracts two environment variables, `UPSTASH_REDIS_REST_TOKEN` and `UPSTASH_REDIS_REST_URL`, which are presumably used for connecting to a Redis database. These variables are expected to be present in the environment.

2. It creates a new instance of the Redis client using the `UPSTASH_REDIS_REST_TOKEN` and `UPSTASH_REDIS_REST_URL` obtained from the environment.

3. It parses the query parameter 'q' from the request URL, converting it to uppercase since the stored data seems to be in uppercase. If the query parameter is missing, it returns a JSON response with an error message and a status code of 400 (Bad Request).

4. It initializes an empty array `res` to hold the search results.

5. It retrieves the rank of the query in a sorted set called 'terms' from the Redis database using the `zrank` method.

6. If the rank is found (`rank !== null && rank !== undefined`), it retrieves a range of elements from the sorted set starting from the rank of the query and ending at `rank + 300`.

7. It iterates over the retrieved elements, checking if they start with the query string. If an element doesn't start with the query string, it breaks out of the loop since the elements are sorted.

8. If an element ends with '*', it removes the '*' character and adds the modified element to the `res` array.

9. It calculates the duration of the operation by measuring the time taken from the beginning (`start`) to the end (`end`) of the code execution using `performance.now()`.

10. It returns a JSON response containing the search results (`res`) and the duration of the operation in milliseconds.

11. If an error occurs during the execution, it catches the error, and if it's an instance of `Error`, it returns a JSON response with the error message and a status code of 500 (Internal Server Error). If the error is of an unknown type, it returns a generic error message.
#### How Redis helps with ranking the database:

Redis sorted sets are optimized for range queries and efficient sorting. When you add elements to a sorted set, you can specify a score for each element. Redis sorts the elements based on these scores, allowing for efficient retrieval of elements within a certain range of scores.

**ZSCORE and ZRANK Operations:** In the code snippet, the zrank operation is used to retrieve the rank of a specific element (query) in the sorted set. The rank is essentially the position of the element in the sorted set based on its score. Redis provides efficient methods like zrank and zrange for retrieving ranks and ranges of elements from sorted sets.

By storing data in a sorted set, Redis enables efficient search operations. In this case, when a user submits a search query, the code retrieves the rank of the query in the 'terms' sorted set. This rank provides information about the position of the query in the sorted set, allowing for further optimizations such as retrieving related terms or autocomplete suggestions efficiently.

Performance: Redis is known for its high performance and low latency. By leveraging Redis for ranking and search operations, the application benefits from Redis's in-memory data storage and efficient data structures, resulting in faster response times for search queries.

#### Cloudflare Involvement

Once done with above, it's time to leverage global API endpoint deployment through Cloudflare. We will use wrangler which is the fastest way to deploy to Cloudflare. Login to [cloudflare worker](https://dash.cloudflare.com/), do 'npm i wrangler', create a wrangler.toml in the repo. 
Do following -

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/88t8cn7jj7ky4lw4emqg.png)

Now add a `deploy` script in pkg.json - 
`"deploy": "wrangler deploy --minify --name <cloudflare workspace name> src/app/api/[[...route]]/route.ts"`, replace <cloudflare workspace name> as u wish.

and `npm run deploy`

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ffifs14pt9q3y59wh2fm.png)

Once done, deployment can be monitored in the Cloudflare worker & page section -

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g2kfbtxybmlshpzxbg4d.png)


Test it using the deployed link, in my case `aadarsh.quickapi99.workers.dev`,  add `/api/search?q=D` -

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m3n2cig9hl7n401hxbxq.png)

Already speed can be observed **42 milisec** or 0.042 seconds
Compared to **538 milisec** in simple localhost - 

![.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ke9w1t5qxf63nrp1yib5.png)

Now Finally we can change our fetch url in useEffect hook from this  
```
await fetch(`/api/search?q=${input}`)
```
 to this 

```
await fetch(`https://aadarsh.quickapi99.workers.dev/api/search?q=${input}`)
```
, **So Our application can be hosted on any provider, but our API that is hosted on the Cloudflare global network will be leveraged here. Providing fast response time.**

## Conclusion

In conclusion, our project showcases the power of innovation in optimizing API performance. By leveraging Next.js, Hono, and Cloudflare Workers, we've created an ultra-high-performance API that sets new standards for speed and efficiency.
