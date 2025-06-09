import { filmApi } from "@/entities/film/api/filmApi";
import { FilmDataEditorForm } from "@/features/filmEditor/ui";
import { FilmMediaEditorForm } from "@/features/filmEditor/ui/FilmMediaEditorForm";
import { useGetAllFilters } from "@/features/filters/lib/hooks";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export const AdminFilmEditorPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: film } = useQuery({
    ...filmApi.getFilmByIdAdminQueryOptions(+id!),
    enabled: !!id,
  });

  const { filters } = useGetAllFilters(true);

  if (!film) {
    return <div>Фильм не найден</div>;
  }

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
        <Tabs defaultValue="data">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="data">
              Данные
            </TabsTrigger>
            <TabsTrigger className="w-full" value="media">
              Медиа
            </TabsTrigger>
          </TabsList>
          <TabsContent value="data">
            <FilmDataEditorForm
              film={film}
              genresOptions={filters?.genres || []}
              actorsOptions={filters?.actors || []}
            />
          </TabsContent>
          <TabsContent value="media">
            <FilmMediaEditorForm film={film} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};
