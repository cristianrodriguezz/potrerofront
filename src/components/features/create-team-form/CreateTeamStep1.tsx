"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMultiStepStore } from "@/lib/store/useMultiStepStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateTeamFormSchema, CreateTeamFormType } from "@/lib/schemas/validation";
import { useTeamAvailability } from "@/hooks/useTeamAvailability";
import { AvailabilityFeedback } from "@/components/ui/AvailabilityFeedback";

export const CreateTeamStep1 = () => {
  // Obtenemos las acciones y datos de nuestra tienda genérica
  const { formData, setFormData, nextStep, prevStep, currentStep } = useMultiStepStore();
  const form = useForm<CreateTeamFormType>({
    resolver: zodResolver(CreateTeamFormSchema),
    defaultValues: {
      team_name: typeof formData.team_name === "string" ? formData.team_name : "",
      alias: typeof formData.alias === "string" ? formData.alias : "",
    },
    mode: "onTouched", 
  });

  const teamName = form.watch('team_name');
  const alias = form.watch('alias');

  const {
    isTeamNameLoading,
    isTeamNameAvailable,
    teamNameError,
    isAliasLoading,
    isAliasAvailable,
    aliasError,
  } = useTeamAvailability(teamName, alias);

  const onSubmit = (data: CreateTeamFormType): void => {
    setFormData(data); // Guarda los datos de este paso
    if (!isAliasAvailable || !isTeamNameAvailable) return; // No avanza si hay errores de disponibilidad
    nextStep();       // Avanza al siguiente
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="team_name"
          render={({ field, fieldState  }) => (
            <FormItem>
              <FormLabel>Nombre del Equipo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Los Halcones" {...field} />
              </FormControl>
              <AvailabilityFeedback
                isLoading={isTeamNameLoading}
                isAvailable={isTeamNameAvailable}
                isDirty={fieldState.isDirty}
                minLength={3}
                value={field.value}
                loadingText="Verificando nombre..."
                availableText="Nombre de equipo disponible"
                errorText={teamNameError}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alias"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Alias (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: LHAL" {...field} />
              </FormControl>
              <AvailabilityFeedback
                isLoading={isAliasLoading}
                isAvailable={isAliasAvailable}
                isDirty={fieldState.isDirty}
                minLength={3}
                value={field.value}
                loadingText="Verificando alias..."
                availableText="Alias disponible"
                errorText={aliasError}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button className="w-1/2 mr-1" type="button" variant="outline" disabled={currentStep === 1} onClick={prevStep}>
            Anterior
          </Button>
          <Button type="submit" disabled={!form.formState.isValid || !isTeamNameAvailable || !isAliasAvailable} className="w-1/2 ml-1">
            Siguiente
          </Button>
        </div>
      </form>
    </Form>
  );
};
