import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch, Info } from "lucide-react";
import { Label } from "@/components/ui/label";

const CORPORATE_BLUE = "#283578";

const exampleRows = [
  { stage: "Criação do Modelo", system: "Audaces Isa/Idea", area: "Estilo / Design", data: "Croqui, referência, coleção", obs: "Dados iniciais" },
  { stage: "Desenvolvimento do Produto", system: "Isa/Idea + ERP", area: "Engenharia", data: "Materiais, consumos", obs: "Ficha parcial" },
  { stage: "Aprovação de Amostra", system: "Audaces Idea", area: "Qualidade / Estilo", data: "Status, comentários", obs: "Workflow de aprovação" },
  { stage: "Ficha Técnica Final", system: "Isa/Idea → ERP", area: "Engenharia / PCP", data: "Ficha completa, grade", obs: "Ponto de integração" },
  { stage: "Ordem de Produção", system: "ERP", area: "PCP", data: "Quantidade, prazo", obs: "Gerada da ficha" },
];

export default function Step4Workflow({ data = { benefits: "", rows: [] }, update, isPrint }: any) {
  
  // Inicializa as 6 linhas da tabela se estiverem vazias
  const rows = data.rows?.length === 6 ? data.rows : Array.from({ length: 6 }).map(() => ({ 
    stage: "", system: "", area: "", data: "", obs: "" 
  }));

  const handleRowChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    update({ ...data, rows: newRows });
  };

  const handleBenefitsChange = (val: string) => {
    update({ ...data, benefits: val });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Instruções */}
      {!isPrint && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
              <GitBranch className="w-5 h-5" /> Instruções
            </CardTitle>
            <CardDescription>
              Descreva os benefícios esperados e mapeie o fluxo completo da ficha técnica.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Benefícios Esperados - OBRIGATÓRIO */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>
            Benefícios Esperados <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription className="text-slate-600">
            Descreva os principais benefícios e dores que o cliente espera resolver com a integração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            placeholder="Ex: Eliminação do retrabalho na digitação de fichas técnicas..."
            value={data.benefits || ""}
            onChange={(e) => handleBenefitsChange(e.target.value)}
            className={isPrint ? "border-none p-0" : ""}
          />
        </CardContent>
      </Card>

      {/* Exemplo de Referência - CORES AJUSTADAS PARA LEITURA */}
      {!isPrint && (
        <Card className="border-slate-200 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Info className="w-4 h-4" /> Exemplo Ilustrativo (apenas referência)
            </CardTitle>
            <CardDescription className="text-slate-700">
              Preencha o <strong>fluxo real do cliente</strong> na tabela editável logo abaixo ↓
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-900 font-bold">Etapa</TableHead>
                  <TableHead className="text-slate-900 font-bold">Sistema</TableHead>
                  <TableHead className="text-slate-900 font-bold">Área</TableHead>
                  <TableHead className="text-slate-900 font-bold">Dados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exampleRows.map((row, i) => (
                  <TableRow key={i} className="text-xs border-slate-200">
                    <TableCell className="font-bold text-slate-800">{row.stage}</TableCell>
                    <TableCell className="text-slate-700">{row.system}</TableCell>
                    <TableCell className="text-slate-700">{row.area}</TableCell>
                    <TableCell className="text-slate-600 italic">{row.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Fluxo do Cliente - EDITÁVEL E RECONHECIDO PELO APP */}
      <Card className={isPrint ? "border-none shadow-none" : ""}>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>Fluxo do Cliente</CardTitle>
          <CardDescription>Mapeie ao menos 3 etapas do processo <span className="text-red-500">*</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etapa</TableHead>
                <TableHead>Sistema Utilizado</TableHead>
                <TableHead>Área Responsável</TableHead>
                <TableHead>Dados Envolvidos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="p-2">
                    <Input 
                      placeholder={`Etapa ${i + 1}`} 
                      value={row.stage || ""} 
                      onChange={(e) => handleRowChange(i, "stage", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      placeholder="Ex: Audaces" 
                      value={row.system || ""} 
                      onChange={(e) => handleRowChange(i, "system", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      placeholder="Ex: Estilo" 
                      value={row.area || ""} 
                      onChange={(e) => handleRowChange(i, "area", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input 
                      placeholder="Dados..." 
                      value={row.data || ""} 
                      onChange={(e) => handleRowChange(i, "data", e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
