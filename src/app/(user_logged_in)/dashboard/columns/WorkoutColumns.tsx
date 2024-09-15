// src/app/(user_logged_in)/dashboard/columns/WorkoutsColumns.tsx

import type { ColumnDef } from "@tanstack/react-table";
import type { Workout } from "~/server/db/types"; // Ensure correct import path
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
    cell: ({ getValue }) => {
      const dateValue = getValue() as string | undefined;
      return dateValue ? new Date(dateValue).toLocaleDateString() : "N/A";
    },
  },
];
