import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch, ClipboardList } from "lucide-react";

const CORPORATE_BLUE = "#283578";

const exampleRows = [
  { stage: "Criação do Modelo", system: "Audaces Isa/Idea", area: "Estilo / Design", data: "Croqui, referência, coleção, linha", obs: "Dados iniciais do produto" },
  { stage: "Desenvolvimento do Produto", system: "Audaces Isa/Idea + ERP", area: "Engenharia de Produto", data: "Materiais, consumos, fornecedores, cores", obs: "Ficha parcial com BOM" },
  { stage: "Aprovação de Amostra", system: "Audaces Idea", area: "Qualidade / Estilo", data: "Status de aprovação, comentários", obs: "Workflow de aprovação" },
  { stage: "Ficha Técnica Final", system: "Audaces Isa/Idea → ERP", area: "Engenharia / PCP", data: "Ficha completa, grade, custos", obs: "Ponto de integração principal" },
  { stage: "Ordem de Produção", system: "ERP", area: "PCP", data: "Quantidade, prazo, roteiro", obs: "Gerada a partir da ficha integrada" },
];

export default function Step4Workflow({ data = { benefits: "", rows: [] }, update, isPrint }: any) {
  
  // Inicializa as 6 linhas editáveis para preenchimento
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. CARD DE INSTRUÇÕES */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <GitBranch className="w-5 h-5" /> Instruções
          </CardTitle>
          <CardDescription>
            Descreva os benefícios esperados e mapeie o fluxo completo da ficha técnica no cliente.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 2. CARD DE BENEFÍCIOS */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>Expectativa do cliente <span className="text-red-500">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={data.benefits || ""}
            onChange={(e) => handleBenefitsChange(e.target.value)}
            placeholder="Ex: Eliminação do retrabalho na digitação de fichas técnicas..."
          />
        </CardContent>
      </Card>

      {/* 3. EXEMPLO ILUSTRATIVO RESTAURADO */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
             📋 Exemplo Ilustrativo (apenas referência)
          </CardTitle>
          <CardDescription className="text-slate-700 font-medium">
            Esta tabela é apenas um exemplo genérico para servir de inspiração.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-900 font-bold">Etapa</TableHead>
                <TableHead className="text-slate-900 font-bold">Sistema</TableHead>
                <TableHead className="text-slate-900 font-bold">Área</TableHead>
                <TableHead className="text-slate-900 font-bold">Dados Envolvidos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exampleRows.map((row) => (
                <TableRow key={row.stage} className="text-sm border-accent/20">
                  <TableCell className="font-bold text-slate-800">{row.stage}</TableCell>
                  <TableCell className="text-slate-700">{row.system}</TableCell>
                  <TableCell className="text-slate-700">{row.area}</TableCell>
                  <TableCell className="text-slate-700">{row.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 4. TABELA EDITÁVEL COM ASTERISCOS NAS 4 COLUNAS */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>Fluxo do Cliente <span className="text-red-500">*</span></CardTitle>
          <CardDescription>As 4 primeiras colunas das 3 primeiras linhas são obrigatórias</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etapa</TableHead>
                <TableHead>Sistema Utilizado</TableHead>
                <TableHead>Área Responsável</TableHead>
                <TableHead>Dados Envolvidos</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, i: number) => {
                const isRequired = i < 3;
                const inputClass = isRequired ? "pr-6 border-orange-200 shadow-sm" : "";
                
                return (
                  <TableRow key={i}>
                    <TableCell className="p-2 relative">
                      <Input 
                        placeholder={`Etapa ${i + 1}`} 
                        value={row.stage || ""}
                        onChange={(e) => handleRowChange(i, "stage", e.target.value)}
                        className={inputClass}
                      />
                      {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold">*</span>}
                    </TableCell>
                    <TableCell className="p-2 relative">
                      <Input 
                        placeholder="Sistema" 
                        value={row.system || ""}
                        onChange={(e) => handleRowChange(i, "system", e.target.value)}
                        className={inputClass}
                      />
                      {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold">*</span>}
                    </TableCell>
                    <TableCell className="p-2 relative">
                      <Input 
                        placeholder="Área" 
                        value={row.area || ""}
                        onChange={(e) => handleRowChange(i, "area", e.target.value)}
                        className={inputClass}
                      />
                      {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold">*</span>}
                    </TableCell>
                    <TableCell className="p-2 relative">
                      <Input 
                        placeholder="Dados..." 
                        value={row.data || ""}
                        onChange={(e) => handleRowChange(i, "data", e.target.value)}
                        className={inputClass}
                      />
                      {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold">*</span>}
                    </TableCell>
                    <TableCell className="p-2">
                      <Input 
                        placeholder="Observações" 
                        value={row.obs || ""}
                        onChange={(e) => handleRowChange(i, "obs", e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
