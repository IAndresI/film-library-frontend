import { Separator } from "@/shared/ui/separator";

import { FilmCard } from "@/entities/film/ui/FilmCard";

import { motion } from "framer-motion";
import { filmApi } from "@/entities/film/api/filmApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useGetAllFilters } from "@/features/filters/lib/hooks";
import { MultiSelect } from "@/shared/ui/multi-select";
import { Input } from "@/shared/ui/input";

export const FilmCategoryPage = () => {
  const { categoryId } = useParams();
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const { filters } = useGetAllFilters();

  const { data } = useQuery({
    ...filmApi.getAvailableFilmsQueryOptions({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      genres: [categoryId!],
      actors: selectedActors,
      search: debouncedSearch,
    }),
    enabled: !!categoryId,
  });

  const currentGenre = filters?.genres.find(
    (genre) => genre.value === categoryId,
  );

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
            <h2 className="text-2xl font-semibold tracking-tight">
              Фильмы в жанре: "{currentGenre?.label}"
            </h2>
          </div>
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
              filters?.actors.map((actor) => ({
                label: actor.label,
                value: actor.value.toString(),
              })) || []
            }
            onValueChange={setSelectedActors}
            defaultValue={selectedActors}
            placeholder="Выберите актеров"
            maxCount={4}
            modalPopover
            className="min-h-9"
          />
        </div>
        <Separator className="my-4" />

        <div className="grid grid-cols-4 place-items-center gap-4 pb-4 xl:grid-cols-5">
          {data?.data && data.data.length > 0 ? (
            data.data.map((film, i) => (
              <FilmCard
                key={`${i}_${film.name}`}
                film={film}
                className="w-[180px] 2xl:w-[200px]"
                aspectRatio="portrait"
              />
            ))
          ) : (
            <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
