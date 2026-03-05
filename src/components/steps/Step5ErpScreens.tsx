import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Monitor, Plus, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

const CORPORATE_BLUE = "#283578";

const categories = [
  { key: "produto", label: "Produto", fields: ["Referência", "Descrição", "Coleção", "Linha", "Grupo", "Subgrupo"] },
  { key: "materiais", label: "Materiais", fields: ["Código", "Descrição", "Unidade", "Consumo", "Fornecedor", "Composição"] },
  { key: "operacoes", label: "Operações / Serviços", fields: ["Operação", "Setor", "Tempo padrão", "Máquina", "Sequência"] },
  { key: "outros", label: "Outros Cadastros", fields: ["Campo", "Descrição", "Valor padrão", "Origem do dado"] },
];

const dataTypes = ["Texto", "Número", "Data", "Lista/Enum", "Booleano", "Código"];

export default function Step5ErpScreens({ data = { rows: [], skipped: {} }, update, isPrint }: any) {
  const [localRows, setLocalRows] = useState<any[]>(data.rows || []);
  const [skipped, setSkipped] = useState<Record<string, boolean>>(data.skipped || {});

  useEffect(() => {
    if (localRows.length === 0) {
      const initial = categories.flatMap(cat => 
        cat.fields.slice(0, 5).map(f => ({ 
          category: cat.key, 
          categoryLabel: cat.label,
          tela: "", 
          campo: f, 
          tipo: "", 
          obrigatorio: "" 
        }))
      );
      setLocalRows(initial);
      update({ rows: initial, skipped: {} });
    }
  }, []);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updated = [...localRows];
    if (!updated[index]) return;
    updated[index][field] = value;
    setLocalRows(updated);
    update({ rows: updated, skipped });
  };

  const handleSkipToggle = (categoryKey: string) => {
    const newSkipped = { ...skipped, [categoryKey]: !skipped[categoryKey] };
    setSkipped(newSkipped);
    update({ rows: localRows, skipped: newSkipped });
  };

  const addRow = (categoryKey: string, categoryLabel: string) => {
    const newRow = { category: categoryKey, categoryLabel, tela: "", campo: "", tipo: "", obrigatorio: "" };
    const updated = [...localRows, newRow];
    setLocalRows(updated);
    update({ rows: updated, skipped });
  };

  if (isPrint) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>3. Telas e Campos do ERP</h3>
        {categories.map((cat) => {
          const isCatSkipped = skipped[cat.key];
          const catRows = localRows.filter(r => r.category === cat.key && r.tela && r.tela.trim() !== "");

          return (
            <div key={cat.key} className="mb-6">
              <h4 className="text-sm font-bold border-b mb-2" style={{ color: CORPORATE_BLUE }}>{cat.label}</h4>
              {isCatSkipped ? (
                <p className="text-xs italic text-slate-500">Não haverá integração para esta categoria.</p>
              ) : catRows.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Módulo / Tela</TableHead>
                      <TableHead className="text-xs">Campo no ERP</TableHead>
                      <TableHead className="text-xs">Tipo / Obrig.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catRows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="py-1 text-xs">{row.tela}</TableCell>
                        <TableCell className="py-1 text-xs">{row.campo}</TableCell>
                        <TableCell className="py-1 text-xs">{row.tipo} ({row.obrigatorio === 'S' ? 'Sim' : 'Não'})</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xs italic text-slate-400">Nenhum campo mapeado.</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 px-1 md:px-0">
      <Card className="border-primary/20 bg-primary/5 no-print">
        <CardHeader className="p-4 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <Monitor className="w-4 h-4 md:w-5 md:h-5" /> Instruções
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Mapeie os campos por categoria. Se não houver integração para um item, marque o check de exclusão.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mx-1 md:mx-0 shadow-sm">
        <CardContent className="p-2 md:p-6">
          <Tabs defaultValue="produto">
            <TabsList className="flex w-full justify-start md:justify-center overflow-x-auto bg-slate-100 p-1 mb-4 no-scrollbar">
              {categories.map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key} className="text-[10px] md:text-xs px-3 md:px-6 font-bold uppercase">
                  {cat.label}
                  {skipped[cat.key] && <Ban className="ml-1 w-3 h-3 text-red-500" />}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => {
              let categoryRowCount = 0;
              const isCatSkipped = skipped[cat.key];

              return (
                <TabsContent key={cat.key} value={cat.key} className="animate-in fade-in duration-300">
                  {/* CHECKBOX DE NÃO TERÁ INTEGRAÇÃO */}
                  <div className="mb-4 flex items-center space-x-3 p-3 bg-slate-50 border rounded-md border-orange-100">
                    <Checkbox 
                      id={`skip-${cat.key}`} 
                      checked={isCatSkipped} 
                      onCheckedChange={() => handleSkipToggle(cat.key)}
                      className="border-slate-400"
                    />
                    <Label 
                      htmlFor={`skip-${cat.key}`} 
                      className="text-xs md:text-sm font-bold text-slate-700 cursor-pointer"
                    >
                      Não haverá integração de {cat.label} neste projeto
                    </Label>
                  </div>

                  <div className={cn("transition-opacity duration-300", isCatSkipped ? "opacity-30 pointer-events-none" : "opacity-100")}>
                    <div className="mb-4 p-3 bg-slate-50 border rounded-md">
                      <p className="text-[10px] md:text-xs text-slate-600 italic">
                        Dicas {cat.label}: {cat.fields.join(", ")}
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto border rounded-md">
                      <Table className="min-w-[700px]">
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead className="text-slate-900 text-xs">Módulo / Tela</TableHead>
                            <TableHead className="text-slate-900 text-xs">Campo no ERP</TableHead>
                            <TableHead className="text-slate-900 text-xs">Tipo de Dado</TableHead>
                            <TableHead className="w-24 text-slate-900 text-xs text-center">Obrig.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {localRows.map((row, i) => {
                            if (row.category !== cat.key) return null;
                            const isRequired = !isCatSkipped && categoryRowCount < 3;
                            categoryRowCount++;
                            const inputClass = `h-9 text-xs ${isRequired ? "pr-6 border-orange-200 shadow-sm" : ""}`;

                            return (
                              <TableRow key={i}>
                                <TableCell className="p-2 relative min-w-[180px]">
                                  <Input 
                                    placeholder="Ex: Cadastro" 
                                    className={inputClass} 
                                    value={row.tela || ""}
                                    onChange={(e) => handleInputChange(i, "tela", e.target.value)}
                                    disabled={isCatSkipped}
                                  />
                                  {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                                </TableCell>
                                <TableCell className="p-2 relative min-w-[180px]">
                                  <Input 
                                    placeholder="Campo" 
                                    className={inputClass} 
                                    value={row.campo || ""}
                                    onChange={(e) => handleInputChange(i, "campo", e.target.value)}
                                    disabled={isCatSkipped}
                                  />
                                  {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                                </TableCell>
                                <TableCell className="p-2 relative min-w-[140px]">
                                  <Select 
                                    value={row.tipo || ""} 
                                    onValueChange={(v) => handleInputChange(i, "tipo", v)}
                                    disabled={isCatSkipped}
                                  >
                                    <SelectTrigger className={inputClass}>
                                      <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dataTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                                    </SelectContent>
                                  </Select>
                                  {isRequired && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs z-10">*</span>}
                                </TableCell>
                                <TableCell className="p-2 relative min-w-[100px]">
                                  <Select 
                                    value={row.obrigatorio || ""} 
                                    onValueChange={(v) => handleInputChange(i, "obrigatorio", v)}
                                    disabled={isCatSkipped}
                                  >
                                    <SelectTrigger className={inputClass}>
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
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-dashed border-slate-300 w-full text-xs py-5"
                      onClick={() => addRow(cat.key, cat.label)}
                      disabled={isCatSkipped}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Adicionar linha em {cat.label}
                    </Button>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
