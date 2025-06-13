import type { SortingState } from '@tanstack/react-table';

export const REVIEW_SORT_OPTIONS: { label: string; value: SortingState }[] = [
  { label: 'По рейтингу', value: [{ id: 'rating', desc: true }] },
  { label: 'По дате добавления', value: [{ id: 'createdAt', desc: true }] },
];
