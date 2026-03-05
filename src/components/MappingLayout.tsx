import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, GitBranch, Monitor, BookOpen, ChevronLeft, ChevronRight, Printer, CheckCircle2
} from "lucide-react";

import Step1Identification from "./steps/Step1Identification";
import Step4Workflow from "./steps/Step4Workflow"; 
import Step5ErpScreens from "./steps/Step5ErpScreens";
import Step6Rules from "./steps/Step6Rules";

const CORPORATE_BLUE = "#283578";
const INACTIVE_TEXT = "#4b5563"; 

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

  // ESTADO GLOBAL: Garante que o PDF receba os dados
  const [formData, setFormData] = useState({
    step1: { cliente: "", erp: "", responsavel: "", escopo: "" },
    step2: { benefits: "", rows: [] }, // Fluxo da Ficha
    step3: [], // Telas do ERP
    step4: { observacoes: "" },
  });

  const updateData = (stepKey: string, data: any) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
  };

  const progress = (completedSteps.size / steps.length) * 100;

  // REGRAS DE VALIDAÇÃO
  const validate = () => {
    if (currentStep === 0) {
      const { cliente, erp, responsavel, escopo } = formData.step1;
      return !!(cliente && erp && responsavel && escopo);
    }
    if (currentStep === 1) {
      const hasBenefits = formData.step2.benefits && formData.step2.benefits.length > 5;
      const hasThreeRows = formData.step2.rows?.filter((r: any) => r.stage && r.stage.length > 1).length >= 3;
      return hasBenefits && hasThreeRows;
    }
    if (currentStep === 2) {
      return formData.step3 && formData.step3.length >= 3;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) {
      let msg = "Preencha todos os campos obrigatórios (*).";
      if (currentStep === 1) msg = "Preencha os benefícios e ao menos 3 etapas do fluxo.";
      if (currentStep === 2) msg = "Adicione pelo menos 3 telas do ERP para prosseguir.";
      
      toast({ title: "Atenção", description: msg, variant: "destructive" });
      return;
    }
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="no-print w-64 shrink-0 bg-white flex flex-col border-r">
        <div className="pt-2 pb-3 px-4 border-b">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: CORPORATE_BLUE }}>Audaces</h1>
          <p className="text-[10px] font-bold" style={{ color: CORPORATE_BLUE }}>Mapeamento de Dados ERP</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isComplete = completedSteps.has(i);
            return (
              <button key={step.id} 
                onClick={() => (isComplete || i < currentStep) && setCurrentStep(i)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left",
                  isActive ? "bg-slate-100 font-bold" : "")}>
                <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                    isComplete ? "bg-green-600 text-white" : isActive ? "text-white" : "bg-gray-300 text-gray-700")}
                  style={isActive && !isComplete ? { backgroundColor: CORPORATE_BLUE } : {}}>
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </span>
                <span style={{ color: isActive ? CORPORATE_BLUE : INACTIVE_TEXT }}>{step.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3 bg-slate-50">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          {/* Botão PDF Fixo com Cor */}
          <Button 
            className="w-full text-white font-bold shadow-md" 
            style={{ backgroundColor: CORPORATE_BLUE, opacity: 1 }} 
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" /> Gerar PDF Completo
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        <header className="no-print border-b px-6 py-2 flex items-center justify-between bg-white shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Etapa {currentStep + 1} de 4</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>Anterior</Button>
            <Button size="sm" onClick={handleNext} style={{ backgroundColor: CORPORATE_BLUE }} className="text-white px-6">
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

        {/* ESTRUTURA PARA O PDF (Lê do Estado Global) */}
        <div className="hidden print:block bg-white p-12">
            <h1 className="text-4xl font-bold mb-2" style={{ color: CORPORATE_BLUE }}>Audaces</h1>
            <p className="text-lg mb-10 border-b-2 pb-4" style={{ color: CORPORATE_BLUE, borderColor: CORPORATE_BLUE }}>Mapeamento de Dados para Integração ERP</p>
            <div className="space-y-20">
              <section className="print-page"><Step1Identification data={formData.step1} isPrint /></section>
              <section className="print-page"><Step4Workflow data={formData.step2} isPrint /></section>
              {/* Repita para os outros passos */}
            </div>
        </div>
      </main>
    </div>
  );
}
