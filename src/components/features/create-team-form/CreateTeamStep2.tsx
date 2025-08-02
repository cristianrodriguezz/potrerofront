"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreateTeamStep2Schema, CreateTeamStep2Type } from "@/lib/schemas/validation";
import { ShapeSelector } from "@/components/features/create-team-form/ShapeSelector";
import { useDraggableIcon } from "@/hooks/useDraggableIcon";
import { CrestPreview } from "./CrestPreview";

const availableIcons = [
  { name: 'sword', label: 'Espada' },
  { name: 'shield', label: 'Escudo' },
  { name: 'zap', label: 'Rayo' },
  { name: 'sun', label: 'Sol' },
];

export const CreateTeamStep2 = (): JSX.Element => {
  const { formData, setFormData, nextStep, prevStep } = useMultiStepStore();

  const defaultCrest = formData.crest || {};
  const defaultPattern = defaultCrest.pattern || {};
  const defaultPosition = defaultCrest.positionIcon || {};

  const form = useForm<CreateTeamStep2Type>({
    resolver: zodResolver(CreateTeamStep2Schema),
    defaultValues: {
      crest: {
        shape: defaultCrest.shape || 'shield-classic',
        backgroundColor: defaultCrest.backgroundColor || '#000000',
        icon: defaultCrest.icon || 'sword',
        iconColor: defaultCrest.iconColor || '#FFFFFF',
        positionIcon: {
          x: defaultPosition.x || 0,
          y: defaultPosition.y || 0,
        },
        pattern: {
          type: defaultPattern.type || 'none',
          color: defaultPattern.color || '#333333',
        },
      },
    },
    mode: "onTouched",
  });

  const crestValues = form.watch('crest');
  
  const draggableProps = useDraggableIcon({
    setValue: form.setValue,
    getValues: form.getValues,
    xFieldName: 'crest.positionIcon.x',
    yFieldName: 'crest.positionIcon.y',
    xMin: -56,
    xMax: 56,
    yMin: -56,
    yMax: 56,
  });
  
  const onSubmit = (data: CreateTeamStep2Type): void => {
    setFormData(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Columna de Controles */}
          <div className="space-y-6 flex-1 w-full">
            <FormField
              control={form.control}
              name="crest.shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma</FormLabel>
                  <FormControl>
                    <ShapeSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="crest.pattern.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patrón</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecciona un patrón" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="stripes">Rayas</SelectItem>
                      <SelectItem value="sash">Banda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="crest.backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Primario</FormLabel>
                    <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="crest.pattern.color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Secundario</FormLabel>
                    <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="crest.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícono</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {availableIcons.map(icon => (
                          <SelectItem key={icon.name} value={icon.name}><span className="capitalize">{icon.label}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="crest.iconColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color del Ícono</FormLabel>
                    <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Columna de Vista Previa */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <FormLabel>Vista Previa (Arrastra el ícono)</FormLabel>
            <div {...draggableProps} className="cursor-grab active:cursor-grabbing">
              <CrestPreview crestValues={crestValues} />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={prevStep}>
            Anterior
          </Button>
          <Button type="submit">Siguiente</Button>
        </div>
      </form>
    </Form>
  );
};
