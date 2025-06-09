import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useEffect, useState } from "react";
import { filmApi } from "@/entities/film/api/filmApi";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/userApi";
import { subscriptionApi } from "@/entities/subscription/api";

const underModerationStatuses = [
  {
    value: "false",
    label: "Да",
  },
  {
    value: "true",
    label: "Нет",
  },
];

const visibilityStatuses = [
  {
    value: "true",
    label: "Да",
  },
  {
    value: "false",
    label: "Нет",
  },
];

const adminStatuses = [
  {
    value: "true",
    label: "Да",
  },
  {
    value: "false",
    label: "Нет",
  },
];

const subscriptionStatuses = [
  {
    value: "active",
    label: "Активна",
  },
  {
    value: "expired",
    label: "Истекла",
  },
  {
    value: "cancelled",
    label: "Отменена",
  },
];

const orderStatuses = [
  {
    value: "pending",
    label: "Обрабатывается",
  },
  {
    value: "paid",
    label: "Оплачен",
  },
  {
    value: "failed",
    label: "Неудачный",
  },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchField?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  searchField,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [search, setValue] = useState("");
  const searchValue = useDebounce(search, 500);

  useEffect(() => {
    if (searchField) {
      const columnFilters = table.getState().columnFilters;
      const existingFilters = columnFilters.filter(
        (filter) => filter.id !== searchField,
      );
      const newFilters =
        searchValue.length > 0
          ? [...existingFilters, { id: searchField, value: searchValue }]
          : existingFilters;

      table.setColumnFilters(newFilters);
    }
  }, [searchValue]);

  const tableColumns = table.getAllColumns();

  const findColumn = (columnId: string) => {
    return tableColumns.find((col) => col.id === columnId);
  };

  const isApprovedColumn = findColumn("isApproved");
  const filmColumn = findColumn("filmId");
  const userColumn = findColumn("userId");
  const genreColumn = findColumn("genres");
  const isAdminColumn = findColumn("isAdmin");
  const isVisibleColumn = findColumn("isVisible");
  const planColumn = findColumn("planId");
  const subscriptionStatusColumn = findColumn("subscriptionStatus");
  const orderStatusColumn = findColumn("orderStatus");

  const { data: genres } = useQuery({
    ...filmApi.getAllGenresQueryOptions(),
  });

  const { data: plans } = useQuery({
    ...subscriptionApi.getAllSubscriptionPlansQueryOptions(),
  });

  const { data: films } = useQuery({
    ...filmApi.getAllFilmsQueryOptions({
      filters: [],
      sort: [],
      pagination: {
        pageIndex: 0,
        pageSize: 99999,
      },
    }),
    enabled: !!filmColumn,
  });

  const { data: users } = useQuery({
    ...userApi.getAllUsersQueryOptions({
      filters: [],
      sort: [],
      pagination: {
        pageIndex: 0,
        pageSize: 99999,
      },
    }),
    enabled: !!userColumn,
  });

  const filmsOptions = films?.data?.map((film) => ({
    value: film.id.toString(),
    label: film.name,
  }));

  const usersOptions = users?.data?.map((user) => ({
    value: user.id.toString(),
    label: user.name,
  }));

  const genresOptions = genres?.map((genre) => ({
    value: genre.id.toString(),
    label: genre.name,
  }));

  const plansOptions = plans?.map((plan) => ({
    value: plan.id.toString(),
    label: plan.name,
  }));

  return (
    <div className="flex justify-between gap-2">
      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {searchField && (
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(event) => setValue(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}
          {genreColumn && genresOptions && (
            <DataTableFacetedFilter
              table={table}
              column={genreColumn}
              title="Жанр"
              useMetaFilterName={true}
              options={genresOptions}
            />
          )}
          {filmColumn && filmsOptions && (
            <DataTableFacetedFilter
              table={table}
              column={filmColumn}
              title="Фильм"
              useMetaFilterName={true}
              options={filmsOptions}
            />
          )}
          {userColumn && usersOptions && (
            <DataTableFacetedFilter
              table={table}
              column={userColumn}
              title="Пользователь"
              useMetaFilterName={true}
              options={usersOptions}
            />
          )}
          {planColumn && plansOptions && (
            <DataTableFacetedFilter
              table={table}
              column={planColumn}
              title="План"
              options={plansOptions}
            />
          )}
          {subscriptionStatusColumn && subscriptionStatuses && (
            <DataTableFacetedFilter
              table={table}
              column={subscriptionStatusColumn}
              title="Статус подписки"
              options={subscriptionStatuses}
            />
          )}
          {orderStatusColumn && orderStatuses && (
            <DataTableFacetedFilter
              table={table}
              column={orderStatusColumn}
              title="Статус заказа"
              options={orderStatuses}
            />
          )}
          {isApprovedColumn && (
            <DataTableFacetedFilter
              table={table}
              column={isApprovedColumn}
              title="На модерации"
              options={underModerationStatuses}
            />
          )}
          {isAdminColumn && (
            <DataTableFacetedFilter
              table={table}
              column={isAdminColumn}
              title="Админ"
              options={adminStatuses}
            />
          )}
          {isVisibleColumn && (
            <DataTableFacetedFilter
              table={table}
              column={isVisibleColumn}
              title="Видимый"
              options={visibilityStatuses}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setValue("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Сбросить
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
