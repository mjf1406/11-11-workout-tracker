import type { ColumnDef } from "@tanstack/react-table";
import type { Workout } from "~/server/db/types";
import Link from "next/link";

export const workoutsColumns: ColumnDef<Workout>[] = [
  {
    header: "Workout ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <Link
        href={`/workouts/${row.original.id}`}
        className="text-blue-500 hover:underline"
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    header: "Exercises Count",
    accessorFn: (row) => row.exercises.length,
    id: "exercisesCount",
  },
  {
    header: "Created Date",
    accessorKey: "created_date",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
];
