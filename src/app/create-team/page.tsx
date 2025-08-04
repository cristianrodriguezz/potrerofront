import { MultiStepContainer } from "@/components/features/multi-step-form/MultiStepContainer";
import { CreateTeamStep1 } from "@/components/features/create-team-form/CreateTeamStep1";

import { CreateTeamStep3 } from "@/components/features/create-team-form/CreateTeamStep3";
// import { CreateTeamStep2 } from "@/components/features/create-team-form/CreateTeamStep2"; // Descomenta cuando crees el paso 2

export default function CreateTeamPage() {
  return (
    <div className="container mx-auto py-10">
      {/* <div className="flex flex-col items-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Crea tu Nuevo Equipo
        </h1>
        <p className="text-muted-foreground">
          Sigue los pasos para registrar tu equipo en la plataforma.
        </p>
      </div> */}
      <div>
        <MultiStepContainer className=" mx-1">
          {/* Cada componente aquí es un paso en el formulario */}
          <CreateTeamStep1 />

          <CreateTeamStep3 />
          
          
          {/* Cuando crees el segundo paso, simplemente impórtalo y añádelo aquí.
            El stepper se encargará de mostrarlo cuando corresponda.
            
            <CreateTeamStep2 /> 
          */}

          {/* Ejemplo de un paso final placeholder */}
          <div>
            <h2 className="text-xl font-semibold">Paso 2: ¡Casi listo!</h2>
            <p className="mt-4">Este es el segundo paso.</p>
          </div>

        </MultiStepContainer>
      </div>
    </div>
  );
}
