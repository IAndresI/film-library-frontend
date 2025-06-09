import { actorApi } from "@/entities/actor/api/actorApi";
import { filmApi } from "@/entities/film/api/filmApi";
import { FilmDataEditorForm } from "@/features/filmEditor/ui";
import { Separator } from "@/shared/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export const AdminFilmCreationPage = () => {
  const { data: genres } = useQuery({
    ...filmApi.getAllGenresQueryOptions(),
  });

  const { data: actors } = useQuery({
    ...actorApi.getAllActorsQueryOptions({
      filters: [],
      sort: [],
      pagination: {
        pageIndex: 0,
        pageSize: 99999,
      },
    }),
  });

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"admin_film_editor"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Добавление фильма
            </h2>
          </div>
        </div>
        <Separator className="my-4" />
        <FilmDataEditorForm genres={genres || []} actors={actors?.data || []} />
      </div>
    </motion.section>
  );
};
