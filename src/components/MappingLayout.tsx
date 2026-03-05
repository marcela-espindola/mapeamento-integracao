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
} from "lucide-react";

// Importação das etapas (Certifique-se que os caminhos estão corretos no seu projeto)
import Step1Identification from "./steps/Step1Identification";
import Step4Workflow from "./steps/Step4Workflow"; 
import Step5ErpScreens from "./steps/Step5ErpScreens";
import Step6Rules from "./steps/Step6Rules";

const CORPORATE_BLUE = "#283578";
const INACTIVE_TEXT = "#4b5563"; // Cinza escuro para leitura

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

  // ESTADO GLOBAL: Centraliza os dados de todos os arquivos para o PDF e Validação
  const [formData, setFormData] = useState({
    step1: { cliente: "", erp: "", responsavel: "", escopo: "" },
    step2: { benefits: "", rows: [] }, // Fluxo da Ficha (Step 4 no seu arquivo)
    step3: [], // Telas do ERP (Step 5 no seu arquivo)
    step4: { observacoes: "" }, // Regras (Step 6 no seu arquivo)
  });

  // Função para atualizar os dados de qualquer etapa
  const updateData = (stepKey: string, data: any) => {
    setFormData((prev) => ({ ...prev, [stepKey]: data }));
  };

  const progress = (completedSteps.size / steps.length) * 100;

  // LÓGICA DE VALIDAÇÃO (Trava o botão Próximo)
  const validate = () => {
    if (currentStep === 0) {
      const d = formData.step1;
      return !!(d.cliente && d.erp && d.responsavel && d.escopo);
    }
    
    if (currentStep === 1) { // Fluxo da Ficha
      const d = formData.step2;
      const benefitsOk = d.benefits && d.benefits.trim().length > 0;
      // Conta linhas que tenham pelo menos a "Etapa" preenchida
      const rowsOk = d.rows?.filter((r: any) => r.stage && r.stage.trim().length > 0).length >= 3;
      return benefitsOk && rowsOk;
    }

    if (currentStep === 2) { // Telas do ERP
      return formData.step3 && formData.step3.length >= 3;
    }

    return true;
  };

  const handleNext = () => {
    if (!validate()) {
      let msg = "Preencha todos os campos obrigatórios (*).";
      if (currentStep === 1) {
        const d = formData.step2;
        if (!(d.benefits && d.benefits.trim().length > 0)) {
          msg = "O campo 'Benefícios Esperados' é obrigatório.";
        } else {
          msg = "Adicione ao menos 3 etapas preenchidas no 'Fluxo do Cliente'.";
        }
      }
      if (currentStep === 2) msg = "Adicione pelo menos 3 telas do ERP para prosseguir.";
      
      toast({ title: "Atenção", description: msg, variant: "destructive" });
      return;
    }

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* SIDEBAR */}
      <aside className="no-print w-64 shrink-0 bg-white flex flex-col border-r shadow-sm">
        {/* Topo da Sidebar reduzido */}
        <div className="pt-2 pb-2 px-4 border-b">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: CORPORATE_BLUE }}>
            Audaces
          </h1>
          <p className="text-[10px] font-bold" style={{ color: CORPORATE_BLUE }}>
            Mapeamento de Dados ERP
          </p>
        </div>

        {/* Navegação entre passos */}
        <nav className="flex-1 p-4 space-y-1">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isComplete = completedSteps.has(i);

            return (
              <button
                key={step.id}
                onClick={() => (isComplete || i < currentStep) && setCurrentStep(i)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all text-left",
                  isActive ? "bg-slate-100 font-bold" : "hover:bg-slate-50"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-colors",
                    isComplete ? "bg-green-600 text-white" : isActive ? "text-white" : "bg-gray-200 text-gray-500"
                  )}
                  style={isActive && !isComplete ? { backgroundColor: CORPORATE_BLUE } : {}}
                >
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </span>
                <span style={{ color: isActive ? CORPORATE_BLUE : INACTIVE_TEXT }}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar com Progress e Botão PDF */}
        <div className="p-4 border-t space-y-3 bg-slate-50/50">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          
          <Button 
            className="w-full text-white font-bold shadow-md active:scale-95 transition-transform" 
            style={{ backgroundColor: CORPORATE_BLUE, opacity: 1 }} 
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" /> 
            Gerar PDF Completo
          </Button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        {/* Header fixo no topo */}
        <header className="no-print border-b px-6 py-2 flex items-center justify-between bg-white shadow-sm z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Etapa {currentStep + 1} de 4
            </span>
            <h2 className="text-sm font-bold text-slate-700">{steps[currentStep].title}</h2>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack} 
              disabled={currentStep === 0}
              className="text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleNext} 
              style={{ backgroundColor: CORPORATE_BLUE }} 
              className="text-white px-6 text-xs font-bold hover:opacity-90"
            >
              {currentStep === 3 ? "Finalizar Mapeamento" : "Próximo"}
              {currentStep < 3 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </header>

        {/* RENDERIZAÇÃO DAS ETAPAS (INTERATIVO) */}
        <div className="flex-1 overflow-auto p-8 print:hidden">
          {currentStep === 0 && (
            <Step1Identification 
              data={formData.step1} 
              update={(d: any) => updateData('step1', d)} 
            />
          )}
          {currentStep === 1 && (
            <Step4Workflow 
              data={formData.step2} 
              update={(d: any) => updateData('step2', d)} 
            />
          )}
          {currentStep === 2 && (
            <Step5ErpScreens 
              data={formData.step3} 
              update={(d: any) => updateData('step3', d)} 
            />
          )}
          {currentStep === 3 && (
            <Step6Rules 
              data={formData.step4} 
              update={(d: any) => updateData('step4', d)} 
            />
          )}
        </div>

        {/* ESTRUTURA PARA O PDF (SÓ APARECE NA IMPRESSÃO) */}
        <div className="hidden print:block bg-white">
          <div className="p-12">
            <header className="flex justify-between items-end border-b-4 pb-4 mb-10" style={{ borderColor: CORPORATE_BLUE }}>
              <div>
                <h1 className="text-4xl font-bold" style={{ color: CORPORATE_BLUE }}>Audaces</h1>
                <p className="text-lg font-bold" style={{ color: CORPORATE_BLUE }}>Mapeamento de Dados para Integração ERP</p>
              </div>
              <div className="text-right text-xs text-slate-400 italic">
                Gerado em {new Date().toLocaleDateString('pt-BR')}
              </div>
            </header>

            <div className="space-y-16">
              <section className="print-page">
                <Step1Identification data={formData.step1} isPrint />
              </section>
              <section className="print-page">
                <Step4Workflow data={formData.step2} isPrint />
              </section>
              <section className="print-page">
                <Step5ErpScreens data={formData.step3} isPrint />
              </section>
              <section className="print-page">
                <Step6Rules data={formData.step4} isPrint />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
