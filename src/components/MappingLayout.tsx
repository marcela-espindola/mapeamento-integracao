import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  GitBranch,
  Monitor,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle2,
  FileCheck,
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
  const [isFinished, setIsFinished] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // ESTADO GLOBAL: Centraliza os dados para validação e PDF
  const [formData, setFormData] = useState({
    step1: { cliente: "", erp: "", responsavel: "", escopo: "" },
    step2: { benefits: "", rows: [] }, 
    step3: [], 
    step4: { observacoes: "" },
  });

  const updateData = (stepKey: string, data: any) => {
    setFormData((prev) => ({ ...prev, [stepKey]: data }));
  };

  const progress = (completedSteps.size / steps.length) * 100;

  const validate = () => {
    if (currentStep === 0) {
      const d = formData.step1;
      return !!(d.cliente && d.erp && d.responsavel && d.escopo);
    }
    if (currentStep === 1) {
      const d = formData.step2;
      const benefitsOk = d.benefits && d.benefits.trim().length > 0;
      const rowsOk = d.rows?.filter((r: any) => r.stage && r.stage.trim().length > 0).length >= 3;
      return benefitsOk && rowsOk;
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
      if (currentStep === 2) msg = "Adicione pelo menos 3 telas do ERP.";
      toast({ title: "Atenção", description: msg, variant: "destructive" });
      return;
    }

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  // --- VISUALIZACAO FINAL (APÓS CONCLUIR) ---
  if (isFinished) {
    return (
      <>
        {/* CONTEÚDO DA TELA: Oculto na impressão pelo 'no-print' */}
        <div className="no-print flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 animate-in zoom-in duration-300">
          <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileCheck className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: CORPORATE_BLUE }}>Mapeamento Finalizado!</h1>
            <p className="text-gray-600 mb-8">Todos os dados foram coletados com sucesso. Gere agora o seu PDF.</p>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full text-white font-bold h-12 text-lg shadow-lg" 
                style={{ backgroundColor: CORPORATE_BLUE }} 
                onClick={() => window.print()}
              >
                <Printer className="w-5 h-5 mr-2" /> Gerar PDF do Relatório
              </Button>
              <Button variant="ghost" className="text-gray-500" onClick={() => setIsFinished(false)}>
                Revisar Dados
              </Button>
            </div>
          </div>
        </div>

        {/* CONTEÚDO DO PDF: Oculto na tela, visível na impressão */}
        <div className="hidden print:block bg-white w-full">
            <div className="p-12 border-b-4 mb-8" style={{ borderColor: CORPORATE_BLUE }}>
               <h1 className="text-4xl font-bold" style={{ color: CORPORATE_BLUE }}>Audaces</h1>
               <p className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>Relatório de Mapeamento de Dados ERP</p>
               <p className="text-xs text-gray-400 mt-2">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <section className="pdf-page px-12"><Step1Identification data={formData.step1} isPrint /></section>
            <section className="pdf-page px-12"><Step4Workflow data={formData.step2} isPrint /></section>
            <section className="pdf-page px-12"><Step5ErpScreens data={formData.step3} isPrint /></section>
            <section className="pdf-page px-12"><Step6Rules data={formData.step4} isPrint /></section>
        </div>
      </>
    );
  }

  // --- VISUALIZACAO DO FORMULÁRIO (PREENCHIMENTO) ---
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="no-print w-64 shrink-0 bg-white flex flex-col border-r">
        <div className="pt-2 pb-2 px-4 border-b">
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
          <p className="text-[10px] text-center text-gray-400 font-medium italic">
            Conclua as etapas para gerar o PDF
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        <header className="no-print border-b px-6 py-2 flex items-center justify-between bg-white shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Etapa {currentStep + 1} de 4</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>
              Anterior
            </Button>
            <Button size="sm" onClick={handleNext} style={{ backgroundColor: CORPORATE_BLUE }} className="text-white px-6">
              {currentStep === 3 ? "Finalizar Mapeamento" : "Próximo"}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 print:hidden">
          {currentStep === 0 && <Step1Identification data={formData.step1} update={(d) => updateData('step1', d)} />}
          {currentStep === 1 && <Step4Workflow data={formData.step2} update={(d) => updateData('step2', d)} />}
          {currentStep === 2 && <Step5ErpScreens data={formData.step3} update={(d) => updateData('step3', d)} />}
          {currentStep === 3 && <Step6Rules data={formData.step4} update={(d) => updateData('step4', d)} />}
        </div>
      </main>
    </div>
  );
}
