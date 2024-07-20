// app/settings/SettingsForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Slider } from "~/components/ui/slider";
import { saveSettings } from "./actions";
import type { SettingsDb } from "~/server/db/types";
import { toast } from "~/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  upper_pull: z.number().min(0).max(10),
  upper_push: z.number().min(0).max(10),
  lower: z.number().min(0).max(10),
  abs: z.number().min(0).max(10),
  sets: z.number().min(1).max(10),
  rest_duration: z
    .number()
    .min(0)
    .max(10 * 60 * 1000),
});

type FormSettingsProps = z.infer<typeof formSchema>;

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: SettingsDb[] | SettingsDb;
}) {
  const [isLoading, setLoading] = useState(false);
  // Extract the settings object from the array if it's an array
  const settings = Array.isArray(initialSettings)
    ? initialSettings[0]
    : initialSettings;
  const { userId } = useAuth();

  const form = useForm<FormSettingsProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upper_pull: settings?.upper_pull,
      upper_push: settings?.upper_push,
      lower: settings?.lower,
      abs: settings?.abs,
      sets: settings?.sets,
      rest_duration: settings?.rest_duration,
    },
  });

  async function onSubmit(data: FormSettingsProps) {
    if (!userId) return null;
    setLoading(true);
    try {
      await saveSettings({
        ...settings,
        ...data,
        user_id: userId,
        created_date: undefined,
        updated_date: undefined,
      });
      toast({
        title: "Success!",
        description: "Settings saved successfully!",
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error!",
        variant: "destructive",
        description: "Settings NOT saved. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const SliderField = ({
    name,
    label,
    description,
    min,
    max,
    step,
    formatValue,
  }: {
    name: keyof FormSettingsProps;
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    formatValue?: (value: number) => string;
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  value={[field.value]}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                  className="w-full"
                />
                <span className="flex w-12 items-center justify-center rounded-md bg-accent px-3 py-1 text-center text-background">
                  {formatValue ? formatValue(field.value) : field.value}
                </span>
              </div>
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  const formatDuration = (value: number) => {
    return (value / (60 * 1000)).toFixed(1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <SliderField
          name="upper_pull"
          label="Upper Pull Exercises"
          description="Number of upper pull exercises per workout"
          min={0}
          max={10}
          step={1}
        />
        <SliderField
          name="upper_push"
          label="Upper Push Exercises"
          description="Number of upper push exercises per workout"
          min={0}
          max={10}
          step={1}
        />
        <SliderField
          name="lower"
          label="Lower Body Exercises"
          description="Number of lower body exercises per workout"
          min={0}
          max={10}
          step={1}
        />
        <SliderField
          name="abs"
          label="Ab Exercises"
          description="Number of ab exercises per workout"
          min={0}
          max={10}
          step={1}
        />
        <SliderField
          name="sets"
          label="Sets per Exercise"
          description="Number of sets for each exercise"
          min={1}
          max={10}
          step={1}
        />
        <SliderField
          name="rest_duration"
          label="Rest Duration (minutes)"
          description="Rest duration between sets (in minutes)"
          min={0}
          max={10 * 60 * 1000} // 10 minutes in milliseconds
          step={30 * 1000} // 30 seconds
          formatValue={formatDuration}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
}
