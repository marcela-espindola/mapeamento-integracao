import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Building2 } from "lucide-react";

const CORPORATE_BLUE = "#283578";

const erpOptions = [
  "Adsomos", "Agely", "Alterdata", "Alsti", "Conceito", "Consistem", "Dapic/ Webpic",
  "Erp Interno", "Linx", "Matriz", "Millennium", "New Century", "Prorius", "Omie",
  "Organiza têxtil", "Sankhya", "Senior", "Siesa", "Sisplan", "Smart.sis",
  "SAP Business One", "Systêxtil", "Totvs Moda", "Upis", "Wiki", "Outro",
];

function FieldHelp({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[250px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Step1Identification({ data = {}, update, isPrint }: any) {
  const handleChange = (field: string, val: string) => {
    if (update) update({ ...data, [field]: val });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Instruções */}
      {!isPrint && (
        <Card className="border-primary/20 bg-primary/5 mx-2 md:mx-0">
          <CardHeader className="p-4 md:pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
              <Building2 className="w-4 h-4 md:w-5 md:h-5" />
              Instruções
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Preencha os dados de identificação do projeto de integração.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className={isPrint ? "border-none shadow-none" : "mx-2 md:mx-0 shadow-sm"}>
        {!isPrint && (
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl" style={{ color: CORPORATE_BLUE }}>
              Dados do Projeto
            </CardTitle>
          </CardHeader>
        )}
        
        {/* Ajuste de Grid: 1 coluna no mobile, 2 no desktop */}
        <CardContent className="p-4 md:p-6 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          
          <div className="space-y-2">
            <Label className="font-bold text-sm md:text-base flex items-center">
              Cliente <span className="text-red-500 ml-1">*</span>
              {!isPrint && <FieldHelp text="Nome da empresa do cliente final." />}
            </Label>
            <Input 
              placeholder="Ex: Malwee, Hering, Farm..." 
              value={data.cliente || ""} 
              onChange={(e) => handleChange("cliente", e.target.value)}
              className={cn(
                "h-10 md:h-11",
                isPrint ? "border-b border-t-0 border-x-0 rounded-none px-0" : ""
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm md:text-base flex items-center">
              ERP Parceiro <span className="text-red-500 ml-1">*</span>
              {!isPrint && <FieldHelp text="Selecione o sistema ERP utilizado pelo cliente." />}
            </Label>
            {isPrint ? (
              <div className="p-2 border-b text-sm">{data.erp || "Não selecionado"}</div>
            ) : (
              <Select value={data.erp || ""} onValueChange={(v) => handleChange("erp", v)}>
                <SelectTrigger className="h-10 md:h-11">
                  <SelectValue placeholder="Selecione o ERP" />
                </SelectTrigger>
                <SelectContent>
                  {erpOptions.map((erp) => (
                    <SelectItem key={erp} value={erp}>{erp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm md:text-base flex items-center">
              Implantador Responsável <span className="text-red-500 ml-1">*</span>
              {!isPrint && <FieldHelp text="Nome do consultor Audaces responsável." />}
            </Label>
            <Input 
              placeholder="Nome do implantador" 
              value={data.responsavel || ""} 
              onChange={(e) => handleChange("responsavel", e.target.value)}
              className={cn(
                "h-10 md:h-11",
                isPrint ? "border-b border-t-0 border-x-0 rounded-none px-0" : ""
              )}
            />
          </div>

          {/* Ocupa 2 colunas apenas no desktop */}
          <div className="space-y-2 md:col-span-2">
            <Label className="font-bold text-sm md:text-base flex items-center">
              Escopo da Integração <span className="text-red-500 ml-1">*</span>
              {!isPrint && <FieldHelp text="Módulos que serão integrados." />}
            </Label>
            <Textarea 
              placeholder="Integração da ficha técnica completa..." 
              value={data.escopo || ""} 
              onChange={(e) => handleChange("escopo", e.target.value)}
              className={cn(
                "min-h-[100px] text-sm md:text-base",
                isPrint ? "border-none px-0" : ""
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Função auxiliar importada do projeto Lovable
import { cn } from "@/lib/utils";
