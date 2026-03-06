import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Monitor, Plus, Ban, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CORPORATE_BLUE = "#283578";

// --- COMPONENTE DE AJUDA (TOOLTIP) ---
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
      <div className="space-y-8">
        <div className="border-b-2 pb-2" style={{ borderColor: CORPORATE_BLUE }}>
          <h2 className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>3. Telas e Campos do ERP</h2>
        </div>

        {categories.map((cat) => {
          const isCatSkipped = skipped[cat.key];
          const catRows = localRows.filter(r => r.category === cat.key && r.tela && r.tela.trim() !== "");

          return (
            <div key={cat.key} className="mb-6">
              <h4 className="text-sm font-bold border-l-4 pl-2 mb-3" style={{ color: CORPORATE_BLUE, borderLeftColor: CORPORATE_BLUE }}>{cat.label}</h4>
              {isCatSkipped ? (
                <p className="text-xs italic text-slate-500">Não haverá integração para esta categoria.</p>
              ) : catRows.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-bold text-xs">Módulo / Tela</TableHead>
                      <TableHead className="text-black font-bold text-xs">Campo no ERP</TableHead>
                      <TableHead className="text-black font-bold text-xs text-right">Tipo / Obrig.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catRows.map((row, i) => (
                      <TableRow key={i} className="border-b border-slate-100">
                        <TableCell className="py-1 text-xs">{row.tela}</TableCell>
                        <TableCell className="py-1 text-xs">{row.campo}</TableCell>
                        <TableCell className="py-1 text-xs text-right">
                           {row.tipo} {row.obrigatorio === 'S' ? '(Obrig.)' : ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xs italic text-slate-400">Nenhum campo mapeado nesta categoria.</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 px-1 md:px-0">
      <Card className="border-primary/20 bg-primary/5 no-print text-sm">
        <CardHeader className="p-4 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <Monitor className="w-4 h-4 md:w-5 md:h-5" /> Instruções
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Navegue pelas abas e mapeie os campos do ERP. Se não houver integração para um item, use o check de exclusão.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mx-1 md:mx-0 shadow-sm">
        <CardHeader className="p-4 md:p-6 pb-0 md:pb-2">
          <CardTitle className="text-base md:text-xl" style={{ color: CORPORATE_BLUE }}>Telas e Campos do ERP</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <Tabs defaultValue="produto">
            <TabsList className="flex w-full justify-start md:justify-center overflow-x-auto bg-slate-100 p-1 mb-4 no-scrollbar">
              {categories.map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key} className="text-[10px] md:text-xs px-3 md:px-6 py-2 font-bold uppercase">
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
                  <div className="mb-4 flex items-center space-x-3 p-3 bg-slate-50 border rounded-md border-orange-100">
                    <Checkbox id={`skip-${cat.key}`} checked={isCatSkipped} onCheckedChange={() => handleSkipToggle(cat.key)} />
                    <Label htmlFor={`skip-${cat.key}`} className="text-xs md:text-sm font-bold text-slate-700 cursor-pointer">
                      Não haverá integração de {cat.label} neste projeto
                    </Label>
                  </div>

                  <div className={cn("transition-opacity duration-300", isCatSkipped ? "opacity-30 pointer-events-none" : "opacity-100")}>
                    <div className="overflow-x-auto border rounded-md">
                      <Table className="min-w-[700px]">
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            {/* CABEÇALHOS COM TOOLTIP */}
                            <TableHead className="text-slate-900 text-xs">
                              <div className="flex items-center">
                                Módulo / Tela <span className="text-red-500 ml-0.5">*</span>
                                <FieldHelp text="Nome do menu ou tela dentro do ERP parceiro." />
                              </div>
                            </TableHead>
                            <TableHead className="text-slate-900 text-xs">
                              <div className="flex items-center">
                                Campo no ERP <span className="text-red-500 ml-0.5">*</span>
                                <FieldHelp text="Nome técnico ou da etiqueta do campo no sistema parceiro." />
                              </div>
                            </TableHead>
                            <TableHead className="text-slate-900 text-xs">
                              <div className="flex items-center">
                                Tipo de Dado <span className="text-red-500 ml-0.5">*</span>
                                <FieldHelp text="Natureza da informação (Texto, Número, Data, etc)." />
                              </div>
                            </TableHead>
                            <TableHead className="w-24 text-slate-900 text-xs">
                              <div className="flex items-center justify-center">
                                Obrig. <span className="text-red-500 ml-0.5">*</span>
                                <FieldHelp text="Indique se o campo é obrigatório para salvar o registro no ERP." />
                              </div>
                            </TableHead>
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
                                  <Input value={row.tela || ""} onChange={(e) => handleInputChange(i, "tela", e.target.value)} className={inputClass} disabled={isCatSkipped} />
                                  {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                                </TableCell>
                                <TableCell className="p-2 relative min-w-[180px]">
                                  <Input value={row.campo || ""} onChange={(e) => handleInputChange(i, "campo", e.target.value)} className={inputClass} disabled={isCatSkipped} />
                                  {isRequired && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">*</span>}
                                </TableCell>
                                <TableCell className="p-2 relative min-w-[140px]">
                                  <Select value={row.tipo || ""} onValueChange={(v) => handleInputChange(i, "tipo", v)} disabled={isCatSkipped}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="Tipo" /></SelectTrigger>
                                    <SelectContent>{dataTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                                  </Select>
                                  {isRequired && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs z-10">*</span>}
                                </TableCell>
                                <TableCell className="p-2 relative min-w-[100px]">
                                  <Select value={row.obrigatorio || ""} onValueChange={(v) => handleInputChange(i, "obrigatorio", v)} disabled={isCatSkipped}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="S/N" /></SelectTrigger>
                                    <SelectContent><SelectItem value="S">Sim</SelectItem><SelectItem value="N">Não</SelectItem></SelectContent>
                                  </Select>
                                  {isRequired && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs z-10">*</span>}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full border-dashed text-xs py-5" onClick={() => addRow(cat.key, cat.label)} disabled={isCatSkipped}>
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
