import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, GitBranch, Monitor, BookOpen, ChevronLeft, ChevronRight, 
  Printer, CheckCircle2, FileCheck, Menu, X 
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // ESTADO GLOBAL: Centraliza os dados para validação e PDF
  const [formData, setFormData] = useState({
    step1: { cliente: "", erp: "", responsavel: "", escopo: "" },
    step2: { benefits: "", rows: [] }, 
    step3: { rows: [], skipped: {} }, // Ajustado para objeto com rows e skipped
    step4: { erpPrints: "", fichaModel: "", checklist: {} }, 
  });

  const updateData = (stepKey: string, data: any) => {
    setFormData((prev) => ({ ...prev, [stepKey]: data }));
  };

  const progress = (completedSteps.size / steps.length) * 100;

  const validate = () => {
    // Validação Etapa 1
    if (currentStep === 0) {
      const d = formData.step1;
      return !!(d.cliente && d.erp && d.responsavel && d.escopo);
    }
    
    // Validação Etapa 2
    if (currentStep === 1) {
      const d = formData.step2;
      const benefitsOk = d.benefits && d.benefits.trim().length > 0;
      const rowsOk = d.rows?.filter((r: any, index: number) => {
        if (index >= 3) return false; 
        return (r.stage?.trim().length > 0 && r.system?.trim().length > 0 && r.area?.trim().length > 0 && r.data?.trim().length > 0);
      }).length >= 3;
      return benefitsOk && rowsOk;
    }

    // Validação Etapa 3 (Telas ERP - com lógica de Skip)
    if (currentStep === 2) {
      const d = formData.step3;
      const rows = d.rows || [];
      const skipped = d.skipped || {};

      // Categorias que existem no Step 5
      const cats = ["produto", "materiais", "operacoes", "outros"];

      // Valida cada categoria individualmente
      const allCatsValid = cats.every(catKey => {
        if (skipped[catKey]) return true; // Válido se estiver marcado como "não terá"
        
        // Conta quantas linhas completas existem para esta categoria
        const count = rows.filter((r: any) => 
          r.category === catKey && 
          r.tela?.trim().length > 0 && 
          r.campo?.trim().length > 0 && 
          r.tipo?.trim().length > 0 && 
          r.obrigatorio?.trim().length > 0
        ).length;
        
        return count >= 3;
      });

      return allCatsValid;
    }

    return true;
  };

  const handleNext = () => {
    if (!validate()) {
      let msg = "Preencha todos os campos obrigatórios (*).";
      if (currentStep === 1) msg = "Preencha os benefícios e as 4 colunas das 3 primeiras etapas do fluxo.";
      if (currentStep === 2) msg = "As categorias ativas devem ter ao menos 3 campos mapeados.";
      
      toast({ title: "Atenção", description: msg, variant: "destructive" });
      return;
    }

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
    setIsMobileMenuOpen(false);
  };

  if (isFinished) {
    return (
      <>
        <div className="no-print flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 animate-in zoom-in duration-300">
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl border border-slate-200 text-center max-w-lg w-full">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileCheck className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <img src="logo-audaces.png" alt="Audaces" className="h-10 md:h-12 mx-auto mb-4 object-contain" />
            <h1 className="text-xl md:text-2xl font-bold mb-2" style={{ color: CORPORATE_BLUE }}>Mapeamento Finalizado!</h1>
            <p className="text-sm md:text-base text-gray-600 mb-8">Todos os dados foram coletados com sucesso. Gere agora o seu PDF.</p>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full text-white font-bold h-12 shadow-lg hover:opacity-90" 
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

        <div className="hidden print:block bg-white w-full">
            <div className="p-12 border-b-4 mb-8" style={{ borderColor: CORPORATE_BLUE }}>
               <img src="logo-audaces.png" alt="Audaces" className="h-8 mb-4 object-contain" />
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Header Mobile */}
      <div className="md:hidden no-print flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <img src="logo-audaces.png" alt="Audaces" className="h-8 object-contain" />
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar Responsiva */}
      <aside className={cn(
        "no-print w-full md:w-64 shrink-0 bg-white flex flex-col border-r shadow-sm transition-all duration-300",
        "fixed md:relative inset-y-0 left-0 z-40 transform md:transform-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:block pt-6 pb-4 px-4 border-b">
          <img src="logo-audaces.png" alt="Audaces" className="h-10 w-auto mb-2 object-contain" />
          <p className="text-sm font-bold" style={{ color: CORPORATE_BLUE }}>Mapeamento de Dados ERP</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isComplete = completedSteps.has(i);
            return (
              <button key={step.id} 
                onClick={() => {
                  if (isComplete || i < currentStep) {
                    setCurrentStep(i);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors text-left",
                  isActive ? "bg-slate-100 font-bold shadow-sm" : "hover:bg-slate-50")}>
                <span className={cn("flex items-center justify-center w-8 h-8 md:w-6 md:h-6 rounded-full text-xs font-bold shrink-0",
                    isComplete ? "bg-green-600 text-white" : isActive ? "text-white" : "bg-gray-200 text-gray-500")}
                  style={isActive && !isComplete ? { backgroundColor: CORPORATE_BLUE } : {}}>
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </span>
                <span style={{ color: isActive ? CORPORATE_BLUE : INACTIVE_TEXT }}>{step.title}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t space-y-3 bg-slate-50">
          <Progress value={progress} className="h-1.5" />
          <p className="text-[10px] text-center text-gray-400 font-medium italic">Mapeamento Audaces ERP</p>
        </div>
      </aside>

      {/* Backdrop Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        <header className="no-print border-b px-4 md:px-6 py-3 flex items-center justify-between bg-white shadow-sm z-10">
          <span className="hidden md:inline text-[10px] font-bold text-gray-400 uppercase tracking-widest">Etapa {currentStep + 1} de 4</span>
          <h2 className="md:hidden text-sm font-bold" style={{ color: CORPORATE_BLUE }}>{steps[currentStep].title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0} className="text-xs h-8">
              <ChevronLeft className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Anterior</span>
            </Button>
            <Button size="sm" onClick={handleNext} style={{ backgroundColor: CORPORATE_BLUE }} className="text-white px-4 md:px-6 font-bold shadow-md text-xs h-8">
              {currentStep === 3 ? "Finalizar" : "Próximo"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 print:hidden">
          {currentStep === 0 && <Step1Identification data={formData.step1} update={(d: any) => updateData('step1', d)} />}
          {currentStep === 1 && <Step4Workflow data={formData.step2} update={(d: any) => updateData('step2', d)} />}
          {currentStep === 2 && <Step5ErpScreens data={formData.step3} update={(d: any) => updateData('step3', d)} />}
          {currentStep === 3 && <Step6Rules data={formData.step4} update={(d: any) => updateData('step4', d)} />}
        </div>
      </main>
    </div>
  );
}
