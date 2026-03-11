import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { HelpCircle, Building2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CORPORATE_BLUE = "#283578";

const erpOptions = [
  "Adsomos", "Agely", "Alterdata", "Alsti", "Conceito", "Consistem", "Dapic/ Webpic",
  "Erp Interno", "Linx", "Matriz", "Millennium", "New Century", "Prorius", "Omie",
  "Organiza têxtil", "Sankhya", "Senior", "Siesa", "Sisplan", "Smart.sis",
  "SAP Business One", "Systêxtil", "Totvs Moda", "Upis", "Wiki", "Outro",
].sort(); // Organiza em ordem alfabética automaticamente

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

export default function Step1Identification({ data = {}, update, isPrint }: any) {
  const [open, setOpen] = useState(false); // Estado para abrir/fechar a busca

  const handleChange = (field: string, val: string) => {
    if (update) update({ ...data, [field]: val });
  };

  // --- LAYOUT EXCLUSIVO PARA O PDF ---
  if (isPrint) {
    return (
      <div className="space-y-8">
        <div className="border-b-2 pb-2" style={{ borderColor: CORPORATE_BLUE }}>
          <h2 className="text-xl font-bold" style={{ color: CORPORATE_BLUE }}>1. Identificação do Projeto</h2>
        </div>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
          <div className="border-b pb-1">
            <p className="text-[10px] uppercase font-bold text-slate-500">Cliente:</p>
            <p className="text-sm font-medium">{data.cliente || "Não informado"}</p>
          </div>
          <div className="border-b pb-1">
            <p className="text-[10px] uppercase font-bold text-slate-500">ERP Parceiro:</p>
            <p className="text-sm font-medium">{data.erp || "Não informado"}</p>
          </div>
          <div className="border-b pb-1">
            <p className="text-[10px] uppercase font-bold text-slate-500">Implantador Responsável:</p>
            <p className="text-sm font-medium">{data.responsavel || "Não informado"}</p>
          </div>
        </div>
        <div className="mt-4 border-b pb-2">
          <p className="text-[10px] uppercase font-bold text-slate-500">Escopo da Integração:</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{data.escopo || "Não informado"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="p-4 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2" style={{ color: CORPORATE_BLUE }}>
            <Building2 className="w-4 h-4 md:w-5 md:h-5" /> Instruções
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-600">
            Preencha os dados de identificação do projeto de integração.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mx-2 md:mx-0 shadow-sm border-slate-200">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-2">
          <CardTitle className="text-base md:text-lg font-bold" style={{ color: CORPORATE_BLUE }}>
            Dados do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          
          <div className="space-y-2">
            <Label className="font-bold text-sm flex items-center">
              Cliente <span className="text-red-500 ml-1">*</span>
              <FieldHelp text="Nome da empresa/marca do cliente final." />
            </Label>
            <Input 
              placeholder="Ex: Malwee, Hering..." 
              value={data.cliente || ""} 
              onChange={(e) => handleChange("cliente", e.target.value)}
              className="h-11 border-slate-300"
            />
          </div>

          {/* CAMPO ERP COM BUSCA (COMBOBOX) */}
          <div className="space-y-2">
            <Label className="font-bold text-sm flex items-center">
              ERP Parceiro <span className="text-red-500 ml-1">*</span>
              <FieldHelp text="Busque o sistema ERP utilizado. Se não achar, use 'Outro'." />
            </Label>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full h-11 justify-between border-slate-300 font-normal text-sm"
                >
                  {data.erp ? erpOptions.find((erp) => erp === data.erp) : "Selecione ou busque o ERP..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Digite para buscar..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Nenhum ERP encontrado.</CommandEmpty>
                    <CommandGroup>
                      {erpOptions.map((erp) => (
                        <CommandItem
                          key={erp}
                          value={erp}
                          onSelect={(currentValue) => {
                            handleChange("erp", currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              data.erp === erp ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {erp}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm flex items-center">
              Implantador Responsável <span className="text-red-500 ml-1">*</span>
              <FieldHelp text="Nome do consultor Audaces." />
            </Label>
            <Input 
              placeholder="Nome do implantador" 
              value={data.responsavel || ""} 
              onChange={(e) => handleChange("responsavel", e.target.value)}
              className="h-11 border-slate-300"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="font-bold text-sm flex items-center">
              Escopo da Integração <span className="text-red-500 ml-1">*</span>
              <FieldHelp text="Módulos que serão integrados." />
            </Label>
            <Textarea 
              placeholder="Ex: Integração da ficha técnica completa incluindo materiais, cores, tamanhos e custos de produção..." 
              value={data.escopo || ""} 
              onChange={(e) => handleChange("escopo", e.target.value)}
              className="min-h-[100px] border-slate-300"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
