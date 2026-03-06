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
  ExternalLink,
  AlertCircle
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

  const [formData, setFormData] = useState({
    step1: { cliente: "", erp: "", responsavel: "", escopo: "" },
    step2: { benefits: "", rows: [] }, 
    step3: { rows: [], skipped: {} }, 
    step4: { erpPrints: "", fichaModel: "", checklist: {} }, 
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
      const rowsOk = d.rows?.filter((r: any, index: number) => {
        if (index >= 3) return false; 
        return (r.stage?.trim().length > 0 && r.system?.trim().length > 0 && r.area?.trim().length > 0 && r.data?.trim().length > 0);
      }).length >= 3;
      return benefitsOk && rowsOk;
    }
    if (currentStep === 2) {
      const d = formData.step3;
      const cats = ["produto", "materiais", "operacoes", "outros"];
      return cats.every(catKey => {
        if (d.skipped?.[catKey]) return true;
        const count = d.rows?.filter((r: any) => 
          r.category === catKey && r.tela?.trim().length > 0 && r.campo?.trim().length > 0 && r.tipo?.trim().length > 0 && r.obrigatorio?.trim().length > 0
        ).length;
        return count >= 3;
      });
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
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else setIsFinished(true);
  };

  if (isFinished) {
    return (
      <>
        {/* TELA DE SUCESSO / GUIA DE ENVIO */}
        <div className="no-print flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 animate-in zoom-in duration-300">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-slate-200 text-center max-w-xl w-full">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            
            <img src="logo-audaces.png" alt="Audaces" className="h-10 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold mb-6" style={{ color: CORPORATE_BLUE }}>Mapeamento Finalizado!</h1>
            
            <div className="space-y-6 text-left mb-8">
              {/* PASSO 1: PDF */}
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passo 1</p>
                    <p className="text-sm font-bold text-slate-700">Gerar Relatório Final</p>
                  </div>
                  <Button 
                    size="sm"
                    className="text-white font-bold shadow-md h-10 px-6" 
                    style={{ backgroundColor: CORPORATE_BLUE }} 
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 mr-2" /> Gerar PDF
                  </Button>
                </div>
              </div>
         {/* PASSO 3: LEMBRETE */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">(Lembrete)</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Não esqueça de <strong>anexar o PDF</strong> que você gerou no Passo 1 dentro do formulário do Insights para que a equipe de integração receba o mapeamento completo.
                  </p>
                </div>
              </div>
            </div>

              {/* PASSO 2: INSIGHTS */}
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passo 2</p>
                    <p className="text-sm font-bold text-slate-700">Solicitar Integração</p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="font-bold h-10 px-6 border-2 border-[#283578] text-[#283578] hover:bg-[#283578] hover:text-white" 
                    onClick={() => window.open('https://insights.audaces.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Abrir Insights
                  </Button>
                </div>
              </div>
            <Button variant="ghost" className="text-gray-400 text-xs" onClick={() => setIsFinished(false)}>
              Revisar ou editar dados do mapeamento
            </Button>
          </div>
        </div>

        {/* ESTRUTURA PARA O PDF */}
        <div className="hidden print:block bg-white w-full">
            <div className="p-12 border-b-4 mb-8" style={{ borderColor: CORPORATE_BLUE }}>
               <img src="logo-audaces.png" alt="Audaces" className="h-14 mb-4 object-contain" />
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

  // --- INTERFACE DE PREENCHIMENTO (IGUAL ANTERIOR COM LOGO h-14) ---
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="no-print w-64 shrink-0 bg-white flex flex-col border-r shadow-sm hidden md:flex">
        <div className="pt-6 pb-4 px-4 border-b">
          <img src="logo-audaces.png" alt="Audaces" className="h-14 w-auto mb-2 object-contain" />
          <p className="text-xs font-bold tracking-tight" style={{ color: CORPORATE_BLUE }}>Mapeamento de Dados ERP</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            return (
              <button key={step.id} onClick={() => (completedSteps.has(i) || i < currentStep) && setCurrentStep(i)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left",
                  isActive ? "bg-slate-100 font-bold shadow-sm" : "hover:bg-slate-50")}>
                <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                    completedSteps.has(i) ? "bg-green-600 text-white" : isActive ? "text-white" : "bg-gray-200 text-gray-500")}
                  style={isActive && !completedSteps.has(i) ? { backgroundColor: CORPORATE_BLUE } : {}}>
                  {completedSteps.has(i) ? <CheckCircle2 className="w-4 h-4" /> : step.id}
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

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        <header className="no-print border-b px-6 py-2 flex items-center justify-between bg-white shadow-sm z-10">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Etapa {currentStep + 1} de 4</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>Anterior</Button>
            <Button size="sm" onClick={handleNext} style={{ backgroundColor: CORPORATE_BLUE }} className="text-white px-6 font-bold shadow-md hover:opacity-90">
              {currentStep === 3 ? "Finalizar Mapeamento" : "Próximo"}
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
