import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch } from "lucide-react";

const CORPORATE_BLUE = "#283578";

export default function Step4Workflow({ data = { benefits: "", rows: [] }, update, isPrint }: any) {
  
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

  if (isPrint) {
    const filledRows = rows.filter((r: any) => r.stage && r.stage.trim() !== "");
    return (
      <div className="space-y-8">
        <div className="border-b-2 pb-2" style={{ borderColor: CORPORATE_BLUE }}>
          <h2 className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>2. Fluxo da Ficha e Benefícios</h2>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-sm" style={{ color: CORPORATE_BLUE }}>Benefícios Esperados:</h3>
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
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <GitBranch className="w-5 h-5" /> Instruções
          </CardTitle>
          <CardDescription>
            Descreva os benefícios e mapeie o fluxo completo da ficha técnica no cliente.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>Benefícios Esperados <span className="text-red-500">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={data.benefits || ""}
            onChange={(e) => handleBenefitsChange(e.target.value)}
            placeholder="Descreva os benefícios esperados..."
          />
        </CardContent>
      </Card>

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
