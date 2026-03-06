import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GitBranch, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CORPORATE_BLUE = "#283578";

// --- COMPONENTE DE AJUDA (TOOLTIP) DEFINIDO AQUI ---
function FieldHelp({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1.5" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] text-xs bg-slate-800 text-white p-2">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const exampleRows = [
  { stage: "Criação do Modelo", system: "Audaces Isa/Idea", area: "Estilo / Design", data: "Croqui, referência, coleção, linha", obs: "Dados iniciais do produto" },
  { stage: "Desenvolvimento do Produto", system: "Audaces Isa/Idea + ERP", area: "Engenharia de Produto", data: "Materiais, consumos, fornecedores, cores", obs: "Ficha parcial com BOM" },
  { stage: "Aprovação de Amostra", system: "Audaces Idea", area: "Qualidade / Estilo", data: "Status de aprovação, comentários", obs: "Workflow de aprovação" },
  { stage: "Ficha Técnica Final", system: "Audaces Isa/Idea → ERP", area: "Engenharia / PCP", data: "Ficha completa, grade, custos", obs: "Ponto de integração principal" },
  { stage: "Ordem de Produção", system: "ERP", area: "PCP", data: "Quantidade, prazo, roteiro", obs: "Gerada a partir da ficha integrada" },
];

export default function Step4Workflow({ data = { benefits: "", rows: [] }, update, isPrint }: any) {
  
  const rows = (data.rows && data.rows.length === 6) 
    ? data.rows 
    : Array.from({ length: 6 }).map(() => ({ stage: "", system: "", area: "", data: "", obs: "" }));

  const handleRowChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    update({ ...data, rows: newRows });
  };

  const handleBenefitsChange = (val: string) => {
    update({ ...data, benefits: val });
  };

  if (isPrint) {
    const filledRows = rows.filter((r: any) => r.stage && r.stage.trim() !== "");
    return (
      <div className="space-y-8">
        <div className="border-b-2 pb-2" style={{ borderColor: CORPORATE_BLUE }}>
          <h2 className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>2. Fluxo da Ficha e Benefícios</h2>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-sm" style={{ color: CORPORATE_BLUE }}>Expectativa do cliente:</h3>
          <p className="text-sm whitespace-pre-wrap text-slate-700">{data.benefits || "Não informado"}</p>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-sm" style={{ color: CORPORATE_BLUE }}>Fluxo do Cliente:</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-300">
                <TableHead className="text-black font-bold">Etapa</TableHead>
                <TableHead className="text-black font-bold">Sistema</TableHead>
                <TableHead className="text-black font-bold">Área</TableHead>
                <TableHead className="text-black font-bold">Dados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filledRows.map((row: any, i: number) => (
                <TableRow key={i} className="border-b border-slate-100">
                  <TableCell className="font-medium text-slate-900">{row.stage}</TableCell>
                  <TableCell>{row.system}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">
      {/* 1. CARD DE INSTRUÇÕES */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="p-4 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <GitBranch className="w-4 h-4 md:w-5 md:h-5" />
            Instruções
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Mapeie o fluxo completo da ficha técnica, desde a criação até a ordem de produção.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 2. CARD DE BENEFÍCIOS */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center" style={{ color: CORPORATE_BLUE }}>
            Expectativa do cliente <span className="text-red-500 ml-1">*</span>
            <FieldHelp text="Descreva qual problema a integração deve resolver e quais resultados o cliente espera obter no processo" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <Textarea
            rows={5}
            value={data.benefits || ""}
            onChange={(e) => handleBenefitsChange(e.target.value)}
            placeholder="Ex: Eliminação do retrabalho na digitação de fichas técnicas, redução de erros na transferência de dados, rastreabilidade de materiais, padronização de cadastros, agilidade na geração de ordens de produção..."
            className="text-sm md:text-base"
          />
        </CardContent>
      </Card>

      {/* 3. EXEMPLO ILUSTRATIVO */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-sm md:text-base text-slate-900 font-bold flex items-center gap-2">
             📋 Exemplo Ilustrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-900 font-bold text-xs">Etapa</TableHead>
                  <TableHead className="text-slate-900 font-bold text-xs">Sistema</TableHead>
                  <TableHead className="text-slate-900 font-bold text-xs">Área</TableHead>
                  <TableHead className="text-slate-900 font-bold text-xs">Dados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exampleRows.map((row, idx) => (
                  <TableRow key={idx} className="text-[11px] md:text-sm border-accent/20">
                    <TableCell className="font-bold text-slate-800">{row.stage}</TableCell>
                    <TableCell className="text-slate-700">{row.system}</TableCell>
                    <TableCell className="text-slate-700">{row.area}</TableCell>
                    <TableCell className="text-slate-700">{row.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. TABELA EDITÁVEL */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center" style={{ color: CORPORATE_BLUE }}>
            Fluxo do Cliente <span className="text-red-500 ml-1">*</span>
            <FieldHelp text="Informe na tabela o fluxo do processo no cliente, detalhando sistema de origem, sistema de destino e dados integrados em cada etapa." />
          </CardTitle>
          <CardDescription className="text-xs">As 4 primeiras colunas das 3 primeiras linhas são obrigatórias</CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Etapa</TableHead>
                  <TableHead className="text-xs">Sistema Utilizado</TableHead>
                  <TableHead className="text-xs">Área Responsável</TableHead>
                  <TableHead className="text-xs">Dados Envolvidos</TableHead>
                  <TableHead className="text-xs">Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row: any, i: number) => {
                  const isRequired = i < 3;
                  const inputClass = cn("text-xs h-9", isRequired && "pr-6 border-orange-200 shadow-sm");
                  
                  return (
                    <TableRow key={i}>
                      <TableCell className="p-2 relative min-w-[150px]">
                        <Input 
                          placeholder={`Etapa ${i + 1}`} 
                          value={row.stage || ""}
                          onChange={(e) => handleRowChange(i, "stage", e.target.value)}
                          className={inputClass}
                        />
                        {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                      </TableCell>
                      <TableCell className="p-2 relative min-w-[150px]">
                        <Input 
                          placeholder="Sistema" 
                          value={row.system || ""}
                          onChange={(e) => handleRowChange(i, "system", e.target.value)}
                          className={inputClass}
                        />
                        {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                      </TableCell>
                      <TableCell className="p-2 relative min-w-[150px]">
                        <Input 
                          placeholder="Área" 
                          value={row.area || ""}
                          onChange={(e) => handleRowChange(i, "area", e.target.value)}
                          className={inputClass}
                        />
                        {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                      </TableCell>
                      <TableCell className="p-2 relative min-w-[180px]">
                        <Input 
                          placeholder="Dados..." 
                          value={row.data || ""}
                          onChange={(e) => handleRowChange(i, "data", e.target.value)}
                          className={inputClass}
                        />
                        {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                      </TableCell>
                      <TableCell className="p-2 min-w-[150px]">
                        <Input 
                          placeholder="Obs" 
                          value={row.obs || ""}
                          onChange={(e) => handleRowChange(i, "obs", e.target.value)}
                          className="text-xs h-9"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
