import { actorApi } from "@/entities/actor/api/actorApi";
import { ActorDataEditorForm } from "@/features/actorEditor/ui/ActorDataEditorForm";
import { Separator } from "@/shared/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export const AdminActorEditorPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: actor } = useQuery({
    ...actorApi.getActorByIdAdminQueryOptions(+id!),
    enabled: !!id,
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
              {id ? "Редактирование актёра" : "Добавление актёра"}
            </h2>
          </div>
        </div>
        <Separator className="my-4" />
        <ActorDataEditorForm actor={actor} />
      </div>
    </motion.section>
  );
};
