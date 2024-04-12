//Hono - Ultrafast web framework for the Edges
import { Redis } from '@upstash/redis'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

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
// deploying this to Cloud flare but also the compatibility benefits of deploying this to versel if we want it to and doing that is one line of code

export const GET = handle(app)

export default app as never
// as never: This is a TypeScript type assertion. It essentially tells the TypeScript compiler to treat app as a value that can never be assigned or used. 
// This is useful when you want to use app as a value that can never be assigned or used.