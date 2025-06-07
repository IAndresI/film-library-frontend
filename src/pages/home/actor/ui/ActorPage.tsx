import { CustomBreadcrumbs } from "@/shared/components/CustomBreadcrumbs";
import { FilmCard } from "@/entities/film/ui/FilmCard";
import { ScrollBar } from "@/shared/ui/scroll-area";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";

import { actorApi } from "@/entities/actor/api/actorApi";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export const ActorPage = () => {
  const { id } = useParams();

  const { isLoading, data } = useQuery({
    ...actorApi.getActorQueryOptions(+id!),
    enabled: !!id,
  });

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      {isLoading && <SvgSpinner className="mx-auto h-10 w-10" />}
      {data ? (
        <div className="h-full px-4 py-6 lg:px-8">
          <CustomBreadcrumbs
            className="mb-4"
            crumbs={[
              { label: "Home", link: "/" },
              { label: "Actors", link: "/actors" },
              { label: data.name },
            ]}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <img
                src={data.image}
                width={100}
                height={100}
                className={
                  "h-[150px] min-w-[150px] overflow-hidden rounded-[100%] object-cover transition-all"
                }
              />

              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold tracking-tight">
                      {data.name}
                    </h1>
                  </div>
                  <div className="text-muted-foreground">{data.birthday}</div>
                  <p className="text-muted-foreground">{data.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Films</h2>
            <p className="text-muted-foreground text-sm">
              {data.films.length} films
            </p>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {data.films.map((film) => (
                  <FilmCard
                    key={film.name}
                    film={film}
                    className="w-[150px]"
                    aspectRatio="square"
                    width={150}
                    height={150}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      ) : (
        "No Info"
      )}
    </motion.section>
  );
};
