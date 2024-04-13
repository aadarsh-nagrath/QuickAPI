'use client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import {useEffect, useState} from 'react';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{
    results: string[]
    duration: number
  }>()
  const [apishift, setApishift] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);
      const res = (!apishift) ? await fetch(`/api/search?q=${input}`): await fetch(`https://aadarsh.quickapi99.workers.dev/api/search?q=${input}`);
      const data = (await res.json()) as { results: string[]; duration: number };
      setSearchResults(data);
    };
    fetchData();
  }, [input]);

  return (
    <main className='h-screen w-screen grainy'>
      <div className='flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5'>
        <p className="fixed left-0 top-[50] flex w-full justify-center border-b border-white bg-gradient-to-b from-black pb-6 pt-8 backdrop-blur-lg dark:border-white dark:bg-black dark:from-transparent lg:absolute lg:left-28 lg:w-auto lg:rounded-xl lg:border lg:bg-gray-800 lg:p-4 lg:dark:bg-black">
          An High Performance API&nbsp;
        </p>

        <div className="relative flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:h-auto lg:w-auto lg:bg-none lg:absolute lg:right-20">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
        </a>
      </div>     
        
        <div className="relative top-[-20px] flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative"
          src="/next.png"
          alt="Next.js Logo"
          width={300}
          height={157}
          priority
        />
      </div>

        <p className=' relative text-white-600 text-sm max-w-prose text-center'>
          A high-performance API built with Hono, Next.js and Cloudflare. <br />{' '}
          Type a query below and get your results in miliseconds.
        </p>

        <div className='max-w-md w-full'>
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder='Search Anime...'
              className='placeholder:text-zinc-500'
            />
            <CommandList>
              {searchResults?.results.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}

              {searchResults?.results ? (
                <CommandGroup heading='Results'>
                  {searchResults?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}>
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {searchResults?.results ? (
                <>
                  <div className='h-px w-full bg-zinc-200' />

                  <p className='p-2 text-xs text-zinc-500'>
                    Found {searchResults.results.length} results in{' '}
                    {searchResults?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
        <TooltipProvider>
          <Tooltip>
          <a href="https://dev.to/aadarsh-nagrath/building-an-high-performance-api-with-nextjs-hono-and-cloudflare-workers-1lpn-temp-slug-4265627"><TooltipTrigger>Read To Know More</TooltipTrigger></a>
            <TooltipContent>
              <p>Click Me</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className='left-0 top-10 relative w-full flex justify-center'>
        <Button onClick={() => setApishift(false)}>Regular Vercel Deployement</Button>
        <Button onClick={() => setApishift(true)}>CloudFlare Global Deployement</Button>
      </div>
    </main>
  )
}