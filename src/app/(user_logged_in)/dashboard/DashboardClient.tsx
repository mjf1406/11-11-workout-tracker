// src/app/(user_logged_in)/dashboard/DashboardClient.tsx

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchExercises,
  fetchSettings,
  fetchWorkouts,
} from "~/app/api/fetchers";
import type {
  ExerciseWithFormattedDays,
  ExercisesResponse,
  Days,
  FormattedDays,
} from "~/server/db/types"; // Ensure correct import path
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DataTable } from "~/components/ui/data-table";

import "~/utils/string-extensions";
import { exercisesColumns } from "./columns/ExerciseColumns";
import { workoutsColumns } from "./columns/WorkoutColumns";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

// Define the formatForcedDays function
const formatForcedDays = (
  forcedDays: Days | undefined,
): FormattedDays | "Every day" | "None" => {
  if (!forcedDays ?? forcedDays?.length === 0) return "None";

  const dayMap: Record<number, FormattedDays[number]> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };

  const array = forcedDays
    ?.map((day) => dayMap[day])
    .filter((day): day is FormattedDays[number] => day !== undefined)
    .sort((a, b) => {
      const order: FormattedDays = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];
      return order.indexOf(a) - order.indexOf(b);
    });

  return array?.length === 7 ? "Every day" : (array as FormattedDays);
};

const DashboardClient: React.FC = () => {
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  const { data: exercises, isLoading: exercisesLoading } = useQuery<
    ExercisesResponse,
    Error,
    ExerciseWithFormattedDays[]
  >({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
    select: (data) =>
      data.map((exercise) => ({
        ...exercise,
        formatted_days: formatForcedDays(exercise.forced_days),
      })),
  });

  // Prepare data for Workouts Over Time (Line Chart)
  const workoutsOverTimeData = React.useMemo(() => {
    if (!workouts) return [];
    const dateMap: Record<string, number> = {};
    workouts.forEach((workout) => {
      if (workout.created_date) {
        const date = new Date(workout.created_date).toLocaleDateString();
        dateMap[date] = (dateMap[date] ?? 0) + 1;
      }
    });
    // Sort dates ascending
    return Object.entries(dateMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({ date, count }));
  }, [workouts]);

  // Prepare data for Exercises by Body Part (Pie Chart)
  const exercisesByBodyPartData = React.useMemo(() => {
    if (!exercises) return [];
    const bodyPartMap: Record<string, number> = {};
    exercises.forEach((exercise) => {
      bodyPartMap[exercise.body_part] =
        (bodyPartMap[exercise.body_part] ?? 0) + 1;
    });
    return Object.entries(bodyPartMap).map(([body_part, value]) => ({
      name: body_part,
      value,
    }));
  }, [exercises]);

  // Combine loading states
  const isLoading = settingsLoading ?? workoutsLoading ?? exercisesLoading;

  return (
    <main className="p-5 text-foreground">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{exercises?.length ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{workouts?.length ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Settings Configured</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{settings ? 1 : 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Workouts Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Workouts Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={workoutsOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Exercises by Body Part */}
            <Card>
              <CardHeader>
                <CardTitle>Exercises by Body Part</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={exercisesByBodyPartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {exercisesByBodyPartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Exercises */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={exercisesColumns} data={exercises ?? []} />
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={workoutsColumns} data={workouts ?? []} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </main>
  );
};

export default DashboardClient;
