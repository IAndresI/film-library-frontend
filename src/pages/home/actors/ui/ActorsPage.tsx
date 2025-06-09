import { Separator } from "@/shared/ui/separator";

import { motion } from "framer-motion";
import { ActorCard } from "@/entities/actor/ui/ActorCard";
import { useQuery } from "@tanstack/react-query";
import { actorApi } from "@/entities/actor/api/actorApi";
import { ActorSkeleton } from "@/entities/actor/ui/ActorSkeleton";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useState } from "react";
import { useGetAllFilters } from "@/features/filters/lib/hooks";
import { MultiSelect } from "@/shared/ui/multi-select";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

export const ActorsPage = () => {
  const [selectedFilms, setSelectedFilms] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const { filters } = useGetAllFilters();

  const { isLoading, data, isSuccess } = useQuery(
    actorApi.getAllActorsQueryOptions({
      search: debouncedSearch,
      films: selectedFilms,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    }),
  );

  const isFiltered = selectedFilms.length > 0 || search.length > 0;

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Актеры</h2>
          </div>
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedFilms([]);
                setSearch("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Сбросить
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-4">
          <Input
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <MultiSelect
            options={
              filters?.films.map((film) => ({
                label: film.label,
                value: film.value.toString(),
              })) || []
            }
            onValueChange={setSelectedFilms}
            defaultValue={selectedFilms}
            placeholder="Выберите фильмы"
            maxCount={4}
            modalPopover
            className="min-h-9"
          />
        </div>
        <Separator className="my-4" />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,150px))] place-items-center justify-between gap-5 pb-4">
          {isLoading &&
            new Array(14)
              .fill(1)
              .map((_, i) => (
                <ActorSkeleton
                  className="h-[150px] w-[150px]"
                  key={`skeleton_actor_${i}`}
                />
              ))}
          {data &&
            data.data.length > 0 &&
            data.data.map((actor) => (
              <ActorCard
                key={actor.name}
                actor={actor}
                aspectRatio="square"
                width={100}
                height={100}
              />
            ))}
          {isSuccess && data && data.data.length === 0 && (
            <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
