import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, GitBranch, Monitor, BookOpen, ChevronLeft, ChevronRight, Printer, CheckCircle2
} from "lucide-react";

// Importação dos componentes de etapa
import Step1Identification from "./steps/Step1Identification";
import Step4Workflow from "./steps/Step4Workflow";
import Step5ErpScreens from "./steps/Step5ErpScreens";
import Step6Rules from "./steps/Step6Rules";

const CORPORATE_BLUE = "#283578";
const INACTIVE_GRAY = "#4b5563"; // Cinza mais escuro solicitado

const steps = [
  { id: 1, title: "Identificação", icon: Building2 },
  { id: 2, title: "Fluxo da Ficha", icon: GitBranch },
  { id: 3, title: "Telas do ERP", icon: Monitor },
  { id: 4, title: "Regras e Docs", icon: BookOpen },
];

export default function MappingLayout() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // ESTADO GLOBAL: Garante que os dados apareçam no PDF
  const [formData, setFormData] = useState({
    step1: { cliente: "", erp: "", responsavel: "", escopo: "" },
    step2: [], // Mínimo 3
    step3: [], // Mínimo 3
    step4: { observacoes: "" },
  });

  const updateData = (stepKey: string, data: any) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
  };

  const progress = (completedSteps.size / steps.length) * 100;

  // VALIDAÇÕES OBRIGATÓRIAS
  const validate = () => {
    if (currentStep === 0) {
      const { cliente, erp, responsavel, escopo } = formData.step1;
      return !!(cliente && erp && responsavel && escopo);
    }
    if (currentStep === 1) return formData.step2.length >= 3;
    if (currentStep === 2) return formData.step3.length >= 3;
    if (currentStep === 3) return !!formData.step4.observacoes;
    return true;
  };

  const handleNext = () => {
    if (!validate()) {
      let message = "Preencha todos os campos obrigatórios (*).";
      if (currentStep === 1 || currentStep === 2) message = "Adicione pelo menos 3 itens para prosseguir.";
      
      toast({ title: "Atenção", description: message, variant: "destructive" });
      return;
    }
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="no-print w-64 shrink-0 bg-white flex flex-col border-r">
        <div className="p-3 border-b">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: CORPORATE_BLUE }}>Audaces</h1>
          <p className="text-[10px] font-bold" style={{ color: CORPORATE_BLUE }}>Mapeamento de Dados ERP</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isComplete = completedSteps.has(i);
            return (
              <button key={step.id} onClick={() => (isComplete || i < currentStep) && setCurrentStep(i)}
                className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                  isActive ? "bg-slate-100 font-bold" : "text-gray-600")}>
                <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                    isComplete ? "bg-green-600 text-white" : isActive ? "text-white" : "bg-gray-300 text-gray-700")}
                  style={isActive && !isComplete ? { backgroundColor: CORPORATE_BLUE } : {}}>
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </span>
                <span style={{ color: isActive ? CORPORATE_BLUE : INACTIVE_GRAY }}>{step.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3">
          <Progress value={progress} className="h-2" />
          <Button className="w-full text-white font-bold" style={{ backgroundColor: CORPORATE_BLUE }} onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Gerar PDF Completo
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="no-print border-b px-6 py-2 flex items-center justify-between bg-white">
          <span className="text-xs text-gray-400 uppercase">Etapa {currentStep + 1} de 4</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>Anterior</Button>
            <Button size="sm" onClick={handleNext} style={{ backgroundColor: CORPORATE_BLUE }} className="text-white">
              {currentStep === 3 ? "Finalizar" : "Próximo"}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 print:hidden">
          {currentStep === 0 && <Step1Identification data={formData.step1} update={(d) => updateData('step1', d)} />}
          {currentStep === 1 && <Step4Workflow data={formData.step2} update={(d) => updateData('step2', d)} />}
          {currentStep === 2 && <Step5ErpScreens data={formData.step3} update={(d) => updateData('step3', d)} />}
          {currentStep === 3 && <Step6Rules data={formData.step4} update={(d) => updateData('step4', d)} />}
        </div>

        {/* ESTRUTURA DO PDF (Visível apenas na impressão) */}
        <div className="hidden print:block">
          {[Step1Identification, Step4Workflow, Step5ErpScreens, Step6Rules].map((Comp, idx) => (
            <div key={idx} className="print-page p-12">
              <div className="flex justify-between items-center border-b-2 pb-4 mb-8" style={{ borderColor: CORPORATE_BLUE }}>
                <h1 className="text-2xl font-bold" style={{ color: CORPORATE_BLUE }}>Audaces - {steps[idx].title}</h1>
              </div>
              <Comp data={idx === 0 ? formData.step1 : idx === 1 ? formData.step2 : idx === 2 ? formData.step3 : formData.step4} isPrint={true} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
