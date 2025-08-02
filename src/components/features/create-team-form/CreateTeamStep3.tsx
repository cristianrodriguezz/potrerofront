"use client";

import { useMultiStepStore } from "@/lib/store/useMultiStepStore";
import { Button } from "@/components/ui/button";

export const CreateTeamStep3 = () => {
  // Leemos el estado completo del formulario y la acción para retroceder
  const { formData, prevStep } = useMultiStepStore();

  // Esta sería la función final para enviar todos los datos a tu backend
  const handleFinalSubmit = () => {
    console.log("Enviando JSON final al backend:", formData);
    // Aquí llamarías a tu Server Action o API con el objeto 'formData'
    // Por ejemplo: await createTeamAction(formData);
    alert("¡Equipo creado! Revisa la consola para ver el JSON.");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paso 3: Confirmar Datos</h2>
      <p className="text-sm text-neutral-400">
        Revisa los datos de tu equipo. Este es el objeto JSON que se guardará.
      </p>
      
      {/* Usamos <pre> para mostrar el JSON con formato */}
      <div className="p-4 rounded-md bg-neutral-900 border border-neutral-700 text-sm overflow-x-auto">
        <pre className="text-white">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button onClick={handleFinalSubmit}>
          Finalizar Creación
        </Button>
      </div>
    </div>
  );
};
