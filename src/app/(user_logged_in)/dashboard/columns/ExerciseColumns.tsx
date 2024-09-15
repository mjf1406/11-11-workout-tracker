import type { ColumnDef } from "@tanstack/react-table";
import type { ExerciseWithFormattedDays } from "~/server/db/types"; // Adjust the import based on your project structure
import Link from "next/link";

export const exercisesColumns: ColumnDef<ExerciseWithFormattedDays>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <Link
        href={`/exercises/${row.original.id}`}
        className="text-blue-500 hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    header: "Body Part",
    accessorKey: "body_part",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Unit",
    accessorKey: "unit",
  },
  {
    header: "Forced Days",
    accessorKey: "formatted_days",
    cell: ({ getValue }) => {
      const days = getValue() as string | string[];
      if (Array.isArray(days)) return days.join(", ");
      return days;
    },
  },
];
