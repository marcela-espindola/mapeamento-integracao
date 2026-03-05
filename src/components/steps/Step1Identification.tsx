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
      <TooltipContent side="right" className="max-w-xs text-xs">
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Instruções - Escondidas no PDF se desejar, ou mantidas */}
      {!isPrint && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
              <Building2 className="w-5 h-5" />
              Instruções
            </CardTitle>
            <CardDescription>
              Preencha os dados de identificação do projeto de integração. Essas informações
              serão usadas como referência em todas as etapas seguintes.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className={isPrint ? "border-none shadow-none" : ""}>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>Dados do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          
          <div className="space-y-2">
            <Label className="font-bold">
              Cliente <span className="text-red-500">*</span>
              {!isPrint && <FieldHelp text="Nome da empresa do cliente final." />}
            </Label>
            <Input 
              placeholder="Ex: Malwee, Hering, Farm..." 
              value={data.cliente || ""} 
              onChange={(e) => handleChange("cliente", e.target.value)}
              className={isPrint ? "border-b border-t-0 border-x-0 rounded-none px-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">
              ERP Parceiro <span className="text-red-500">*</span>
              {!isPrint && <FieldHelp text="Selecione o sistema ERP utilizado." />}
            </Label>
            {isPrint ? (
              <div className="p-2 border-b">{data.erp || "Não selecionado"}</div>
            ) : (
              <Select value={data.erp || ""} onValueChange={(v) => handleChange("erp", v)}>
                <SelectTrigger>
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
            <Label className="font-bold">
              Implantador Responsável <span className="text-red-500">*</span>
              {!isPrint && <FieldHelp text="Nome do consultor Audaces." />}
            </Label>
            <Input 
              placeholder="Nome do implantador" 
              value={data.responsavel || ""} 
              onChange={(e) => handleChange("responsavel", e.target.value)}
              className={isPrint ? "border-b border-t-0 border-x-0 rounded-none px-0" : ""}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-bold">
              Escopo da Integração <span className="text-red-500">*</span>
              {!isPrint && <FieldHelp text="Módulos que serão integrados." />}
            </Label>
            <Textarea 
              placeholder="Integração da ficha técnica completa entre o ERP e o Audaces, incluindo produto, materiais, grade, consumo, sequência operacional e custos." 
              value={data.escopo || ""} 
              onChange={(e) => handleChange("escopo", e.target.value)}
              className={isPrint ? "border-none px-0" : "min-h-[100px]"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
