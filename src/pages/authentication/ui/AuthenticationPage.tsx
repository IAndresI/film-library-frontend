import { Navigate } from "react-router-dom";
import { UserAuthForm } from "@/features/auth/ui/UserAuthForm";
import { SvgLogo } from "@/shared/ui/svg/SvgLogo";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api";

export const AuthenticationPage = () => {
  const { data: user, isLoading } = useQuery(authApi.getAuthQueryOptions());

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate replace to={"/"} />;
  }

  return (
    <div className="relative container grid min-h-[100svh] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <SvgLogo className="mr-2 h-6 w-6" />
          Фильмотека
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;С помощью этой библиотеки фильмов я обнаружила бесконечные
              вдохновение и упростила поиск любимых фильмов.&rdquo;
            </p>
            <footer className="text-sm">София Кондратьева</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Авторизация
            </h1>
            <p className="text-muted-foreground text-sm">
              Введите ваш email ниже для входа в систему
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
};
