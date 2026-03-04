import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  GitBranch,
  Monitor,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle2,
} from "lucide-react";
import Step1Identification from "./steps/Step1Identification";
import Step4Workflow from "./steps/Step4Workflow";
import Step5ErpScreens from "./steps/Step5ErpScreens";
import Step6Rules from "./steps/Step6Rules";

const steps = [
  { id: 1, title: "Identificação", icon: Building2 },
  { id: 2, title: "Fluxo da Ficha", icon: GitBranch },
  { id: 3, title: "Telas do ERP", icon: Monitor },
  { id: 4, title: "Regras e Docs", icon: BookOpen },
];

const stepComponents = [
  Step1Identification,
  Step4Workflow,
  Step5ErpScreens,
  Step6Rules,
];

export default function MappingLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = (completedSteps.size / steps.length) * 100;
  const StepComponent = stepComponents[currentStep];

  const markComplete = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Oculta na impressão */}
      <aside className="no-print w-64 shrink-0 bg-sidebar-background text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          {/* AJUSTE: Mudei a cor para azul aqui (text-blue-600) */}
          <h1 className="text-xl font-bold tracking-tight text-blue-600">
            Audaces
          </h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            Mapeamento de Dados ERP
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isComplete = completedSteps.has(i);
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0",
                    isComplete
                      ? "bg-green-600 text-white"
                      : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-sidebar-border text-sidebar-foreground/60"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-sidebar-foreground/60">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            Gerar Relatório Completo
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Oculto na impressão */}
        <header className="no-print border-b px-6 py-3 flex items-center justify-between bg-card">
          <div>
            <p className="text-xs text-muted-foreground">
              Etapa {currentStep + 1} de {steps.length}
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              {steps[currentStep].title}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            <Button size="sm" onClick={markComplete} className="bg-blue-600 hover:bg-blue-700">
              {currentStep < steps.length - 1 ? (
                <>
                  Concluir e Avançar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                "Finalizar Mapeamento"
              )}
            </Button>
          </div>
        </header>

        {/* Conteúdo da Etapa Atual - Visível apenas na tela */}
        <div className="flex-1 overflow-auto p-6 print:hidden">
          <StepComponent />
        </div>

        {/* VISUAL DE IMPRESSÃO - Visível apenas no papel/PDF */}
        <div className="hidden print:block p-8 space-y-12">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-blue-600">Audaces</h1>
            <h2 className="text-xl text-gray-600">Relatório de Mapeamento de Dados ERP</h2>
          </div>
          
          {stepComponents.map((Component, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-3">
                {steps[index].id}. {steps[index].title}
              </h3>
              <Component />
              <div className="page-break" /> {/* Quebra página entre seções se necessário */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
