import { motion } from 'framer-motion';

import { FilmDataEditorForm } from '@/features/filmEditor/ui';

import { useGetAllFilters } from '@/entities/filters/lib/hooks';

import { Separator } from '@/shared/ui/separator';

export const AdminFilmCreationPage = () => {
  const { filters } = useGetAllFilters(true);

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'admin_film_editor'}
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
        <FilmDataEditorForm
          genresOptions={filters?.genres || []}
          actorsOptions={filters?.actors || []}
        />
      </div>
    </motion.section>
  );
};
