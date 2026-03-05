import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Monitor, Plus } from "lucide-react";

const CORPORATE_BLUE = "#283578";

const categories = [
  { key: "produto", label: "Produto", fields: ["Referência", "Descrição", "Coleção", "Linha", "Grupo", "Subgrupo"] },
  { key: "materiais", label: "Materiais", fields: ["Código", "Descrição", "Unidade", "Consumo", "Fornecedor", "Composição"] },
  { key: "operacoes", label: "Operações", fields: ["Operação", "Setor", "Tempo padrão", "Máquina", "Sequência"] },
  { key: "outros", label: "Outros", fields: ["Campo", "Descrição", "Valor padrão", "Origem do dado"] },
];

const dataTypes = ["Texto", "Número", "Data", "Lista/Enum", "Booleano", "Código"];

export default function Step5ErpScreens({ data = [], update, isPrint }: any) {
  const [localRows, setLocalRows] = useState<any[]>(data.length > 0 ? data : []);

  useEffect(() => {
    if (localRows.length === 0) {
      const initial = categories.flatMap(cat => 
        cat.fields.slice(0, 3).map(f => ({ 
          category: cat.key, 
          categoryLabel: cat.label,
          tela: "", 
          campo: f, 
          tipo: "", 
          obrigatorio: "" 
        }))
      );
      setLocalRows(initial);
      update(initial);
    }
  }, []);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updated = [...localRows];
    if (!updated[index]) return;
    
    updated[index][field] = value;
    setLocalRows(updated);

    // Envia para o MappingLayout filtrar e contar para a validação
    const filledRows = updated.filter(row => row.tela && row.tela.trim() !== "");
    update(filledRows);
  };

  const addRow = (categoryKey: string, categoryLabel: string) => {
    const newRow = { category: categoryKey, categoryLabel, tela: "", campo: "", tipo: "", obrigatorio: "" };
    const updated = [...localRows, newRow];
    setLocalRows(updated);
  };

  if (isPrint) {
    const rowsToPrint = localRows.filter(r => r.tela && r.tela.trim() !== "");
    return (
      <div className="space-y-6">
        <div className="border-b-2 pb-2" style={{ borderColor: CORPORATE_BLUE }}>
          <h2 className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>3. Telas e Campos do ERP</h2>
        </div>
        {rowsToPrint.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-300">
                <TableHead className="text-black font-bold">Categoria</TableHead>
                <TableHead className="text-black font-bold">Módulo / Tela</TableHead>
                <TableHead className="text-black font-bold">Campo no ERP</TableHead>
                <TableHead className="text-black font-bold">Tipo / Obrig.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowsToPrint.map((row, i) => (
                <TableRow key={i} className="border-b border-slate-100">
                  <TableCell className="font-bold text-slate-900">{row.categoryLabel || row.category}</TableCell>
                  <TableCell className="text-slate-700">{row.tela}</TableCell>
                  <TableCell className="text-slate-700">{row.campo}</TableCell>
                  <TableCell className="text-slate-700">
                    {row.tipo} {row.obrigatorio === 'S' ? '(Obrigatório)' : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-slate-500 italic text-sm">Nenhuma tela ou campo foi mapeado.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-primary/20 bg-primary/5 no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <Monitor className="w-5 h-5" /> Instruções
          </CardTitle>
          <CardDescription>
            Liste as telas do ERP. As 3 primeiras linhas de cada aba são obrigatórias para o mapeamento mínimo.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: CORPORATE_BLUE }}>Telas e Campos do ERP</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="produto">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 p-1 mb-4">
              {categories.map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key} className="text-xs px-4">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => {
              let categoryRowCount = 0;
              return (
                <TabsContent key={cat.key} value={cat.key} className="animate-in fade-in duration-300">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-900">Módulo / Tela</TableHead>
                        <TableHead className="text-slate-900">Campo no ERP</TableHead>
                        <TableHead className="text-slate-900">Tipo de Dado</TableHead>
                        <TableHead className="w-24 text-slate-900">Obrig.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localRows.map((row, i) => {
                        if (row.category !== cat.key) return null;
                        
                        const isRequired = categoryRowCount < 3;
                        categoryRowCount++;
                        const inputClass = isRequired ? "pr-6 border-orange-200 shadow-sm" : "text-xs";

                        return (
                          <TableRow key={i}>
                            <TableCell className="p-2 relative">
                              <Input 
                                placeholder="Ex: Cadastro" 
                                className={inputClass} 
                                value={row.tela || ""}
                                onChange={(e) => handleInputChange(i, "tela", e.target.value)}
                              />
                              {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                            </TableCell>
                            <TableCell className="p-2 relative">
                              <Input 
                                placeholder="Campo" 
                                className={inputClass} 
                                value={row.campo || ""}
                                onChange={(e) => handleInputChange(i, "campo", e.target.value)}
                              />
                              {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                            </TableCell>
                            <TableCell className="p-2 relative">
                              <Select 
                                value={row.tipo || ""} 
                                onValueChange={(v) => handleInputChange(i, "tipo", v)}
                              >
                                <SelectTrigger className={`h-9 text-xs ${isRequired ? "border-orange-200 shadow-sm" : ""}`}>
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataTypes.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {isRequired && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs z-10">*</span>}
                            </TableCell>
                            <TableCell className="p-2 relative">
                              <Select 
                                value={row.obrigatorio || ""} 
                                onValueChange={(v) => handleInputChange(i, "obrigatorio", v)}
                              >
                                <SelectTrigger className={`h-9 text-xs ${isRequired ? "border-orange-200 shadow-sm" : ""}`}>
                                  <SelectValue placeholder="S/N" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="S">Sim</SelectItem>
                                  <SelectItem value="N">Não</SelectItem>
                                </SelectContent>
                              </Select>
                              {isRequired && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs z-10">*</span>}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-dashed border-slate-300 w-full text-xs"
                    onClick={() => addRow(cat.key, cat.label)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Adicionar nova linha em {cat.label}
                  </Button>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
