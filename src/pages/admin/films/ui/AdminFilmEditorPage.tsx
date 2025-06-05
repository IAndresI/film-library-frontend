import { actorApi } from "@/entities/actor/api/actorApi";
import { filmApi } from "@/entities/film/api/filmApi";
import { FilmDataEditorForm } from "@/features/filmEditor/ui";
import { Separator } from "@/shared/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export const AdminFilmEditorPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: film } = useQuery({
    ...filmApi.getFilmByIdAdminQueryOptions(+id!),
    enabled: !!id,
  });

  const { data: genres } = useQuery({
    ...filmApi.getAllGenresQueryOptions(),
  });

  const { data: actors } = useQuery({
    ...actorApi.getAllActorsQueryOptions(),
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
              {id ? "Редактирование фильма" : "Добавление фильма"}
            </h2>
          </div>
        </div>
        <Separator className="my-4" />
        <FilmDataEditorForm
          film={film}
          genres={genres || []}
          actors={actors || []}
        />
      </div>
    </motion.section>
  );
};
