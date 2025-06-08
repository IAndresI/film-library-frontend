import { Separator } from "@/shared/ui/separator";

import { FilmCard } from "@/entities/film/ui/FilmCard";

import { motion } from "framer-motion";
import { filmApi } from "@/entities/film/api/filmApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const FilmCategoryPage = () => {
  const { categoryId } = useParams();

  const { data } = useQuery(
    filmApi.getAvailableFilmsQueryOptions(categoryId ? +categoryId : undefined),
  );

  const currentGenre = data
    ? data.data[0]?.genres?.find((genre) => genre.id === Number(categoryId))
    : null;

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
              {currentGenre?.name}
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="grid grid-cols-4 place-items-center gap-4 pb-4 xl:grid-cols-5">
          {data?.data?.map((film, i) => (
            <FilmCard
              key={`${i}_${film.name}`}
              film={film}
              className="w-[180px] 2xl:w-[200px]"
              aspectRatio="portrait"
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};
