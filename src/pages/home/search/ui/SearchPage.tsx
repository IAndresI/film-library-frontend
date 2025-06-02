import { Separator } from "@/shared/ui/separator";

import { FilmCard } from "@/entities/film/ui/FilmCard";

import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ScrollBar } from "@/shared/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ActorCard } from "@/entities/actor/ui/ActorCard";
import { searchApi } from "@/features/search/api/searchApi";
import { useQuery } from "@tanstack/react-query";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(location.search);
  const [queryText, setQueryText] = useState(location.search);

  const { isLoading, data } = useQuery({
    ...searchApi.search(queryText),
    enabled: queryText.length > 0,
  });

  useEffect(() => {
    const URLSearchText = searchParams.get("query");
    if (URLSearchText) {
      setSearchText(URLSearchText);
    } else {
      setSearchText("");
    }
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQueryText(searchText);
      searchParams.set("query", searchText);
      setSearchParams(searchParams);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Search{" "}
              {searchParams.get("query") && (
                <>
                  for:{" "}
                  <span className="font-normal">
                    {searchParams.get("query")}
                  </span>
                </>
              )}
            </h2>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchParams.set("query", searchText);
            setSearchParams(searchParams);
          }}
          className="flex w-full max-w-[500px] items-center gap-3 pb-4"
        >
          <Input
            type="search"
            placeholder="Enter text..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            className="flex items-center gap-2 px-3"
            variant="default"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Button>
        </form>
        <Separator className="mb-4" />
        {isLoading && <SvgSpinner className="mx-auto h-10 w-10" />}
        {queryText.length <= 0 && "Enter search text"}
        {data &&
          data.actors.length <= 0 &&
          data.movies.length <= 0 &&
          "Nothings found"}
        {data && queryText.length > 0 && (
          <>
            {data.actors.length > 0 && (
              <>
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Actors
                  </h2>
                </div>
                <Separator className="my-4" />
                <div className="">
                  <ScrollArea className="overflow-auto">
                    <div className="flex space-x-4 pb-4">
                      {data.actors.map((actor) => (
                        <ActorCard
                          key={actor.name}
                          actor={actor}
                          className="w-[150px] min-w-[150px]"
                          aspectRatio="square"
                          width={100}
                          height={100}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </>
            )}
            {data.movies.length > 0 && (
              <>
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Films
                  </h2>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea className="overflow-auto">
                    <div className="flex space-x-4 pb-4">
                      {data.movies.map((film) => (
                        <FilmCard
                          key={film.name}
                          film={film}
                          className="w-[150px] min-w-[150px]"
                          aspectRatio="square"
                          width={150}
                          height={150}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
};
