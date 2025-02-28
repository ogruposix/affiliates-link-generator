'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, CheckIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';

interface OfertaPerformance {
  id: string;
  funil: string;
  vsl: number;
  lead: string;
  rede: string;
  ultimaAtualizacao: string;
}

interface AffiliateFunilId {
  funil: string;
  afid: string;
}

const StepsHeader: React.FC<{ currentStage: number }> = ({ currentStage }) => {
  const steps = [
    'Selecionar Ofertas',
    'Configurar IDs',
    'Gerar Links'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-center items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${currentStage > index + 1 ? 'bg-green-500' :
                currentStage === index + 1 ? 'bg-blue-500' : 'bg-gray-400'}
              text-white font-bold
            `}>
              {index + 1}
            </div>
            <span className={`
              ml-2 
              ${currentStage === index + 1 ? 'text-blue-500 font-medium' : 'text-gray-500'}
            `}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="mx-4 h-[2px] w-16 bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [stage, setStage] = useState(1);
  const [affiliateIds, setAffiliateIds] = useState<AffiliateFunilId[]>([]);
  const [copied, setCopied] = useState(false);
  const [ofertasSelecionadas, setOfertasSelecionadas] = useState<string[]>([]);

  const ofertas: OfertaPerformance[] = [
    {
      id: '1',
      funil: 'LipoGummies',
      vsl: 4,
      lead: 'Lead 2 Microlead 12',
      rede: 'Facebook',
      ultimaAtualizacao: '2025-02-28'
    },
    {
      id: '2',
      funil: 'LipoGummies',
      vsl: 4,
      lead: 'Lead 1',
      rede: 'Youtube',
      ultimaAtualizacao: '2025-02-28'
    },
    {
      id: '3',
      funil: 'SugarSix',
      vsl: 3,
      lead: 'Lead 1',
      rede: 'Facebook/Youtube',
      ultimaAtualizacao: '2025-02-28'
    },
    {
      id: '4',
      funil: 'AlphaGummy',
      vsl: 4,
      lead: 'Lead 1',
      rede: 'Facebook/Youtube',
      ultimaAtualizacao: '2025-02-28'
    },
    {
      id: '5',
      funil: 'FloraLean',
      vsl: 8,
      lead: 'Lead 1',
      rede: 'Facebook/Youtube',
      ultimaAtualizacao: '2025-02-28'
    },
  ];

  const handleOfertaSelect = (ofertaId: string) => {
    setOfertasSelecionadas(prev => {
      if (prev.includes(ofertaId)) {
        return prev.filter(id => id !== ofertaId);
      } else {
        return [...prev, ofertaId];
      }
    });
  };

  const handleContinuar = () => {
    if (ofertasSelecionadas.length > 0) {
      setStage(2);
    }
  };

  const getFunilsSelecionados = () => {
    const funilsUnicos = new Set(
      ofertasSelecionadas
        .map(id => ofertas.find(o => o.id === id)?.funil)
        .filter((funil): funil is string => funil !== undefined)
    );
    return Array.from(funilsUnicos);
  };

  const getAfidForFunil = (funil: string) => {
    return affiliateIds.find(a => a.funil === funil)?.afid || '';
  };

  const handleAfidChange = (funil: string, afid: string) => {
    setAffiliateIds(prev => {
      const filtered = prev.filter(a => a.funil !== funil);
      return [...filtered, { funil, afid }];
    });
  };

  const handleSubmitAfids = (e: React.FormEvent) => {
    e.preventDefault();
    const funilsSelecionados = getFunilsSelecionados();
    const todosPreenchidos = funilsSelecionados.every(funil =>
      getAfidForFunil(funil)
    );

    if (todosPreenchidos) {
      setStage(3);
    }
  };

  const handleCopyLink = (oferta: OfertaPerformance) => {
    const afid = getAfidForFunil(oferta.funil);
    if (afid) {
      const linkToCopy = `https://mitolyn.com/&affiliate=${afid}`;
      navigator.clipboard.writeText(linkToCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold">Selecione as Ofertas Performáticas</h2>
              <CardDescription>
                Escolha as ofertas que deseja disponibilizar para o afiliado com base nas leads mais performáticas por rede.
              </CardDescription>
            </CardHeader>
            <CardContent>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Selecionar</TableHead>
                    <TableHead>Funil</TableHead>
                    <TableHead>VSL</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Rede</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ofertas.map((oferta) => (
                    <TableRow key={oferta.id}>
                      <TableCell>
                        <Checkbox className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                          checked={ofertasSelecionadas.includes(oferta.id)}
                          onCheckedChange={() => handleOfertaSelect(oferta.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{oferta.funil}</TableCell>
                      <TableCell>{oferta.vsl}</TableCell>
                      <TableCell>{oferta.lead}</TableCell>
                      <TableCell>{oferta.rede}</TableCell>
                      <TableCell>{new Date(oferta.ultimaAtualizacao).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleContinuar}
                disabled={ofertasSelecionadas.length === 0}
              >
                Continuar
              </Button>
            </CardFooter>
          </Card>
        );

      case 2:
        const funilsSelecionados = getFunilsSelecionados();

        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configure os IDs de Afiliado</CardTitle>
              <CardDescription>
                Digite o ID de afiliado específico para cada funil selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAfids} className="space-y-6">
                {funilsSelecionados.map((funil) => (
                  <div key={funil} className="space-y-2">
                    <label className="font-medium">
                      ID de Afiliado para {funil}:
                    </label>
                    <Input
                      type="text"
                      placeholder={`AFID para ${funil}`}
                      value={getAfidForFunil(funil)}
                      onChange={(e) => handleAfidChange(funil, e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                ))}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!funilsSelecionados.every(funil => getAfidForFunil(funil))}
                >
                  Gerar Links
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 3:
        const ofertasSelecionadasDetalhes = ofertas.filter(o =>
          ofertasSelecionadas.includes(o.id)
        );

        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Links Gerados</CardTitle>
              <CardDescription>
                Seus links de afiliado para as ofertas selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ofertasSelecionadasDetalhes.map((oferta) => (
                <div key={oferta.id} className="space-y-2">
                  <div className="font-bold">
                    {oferta.funil} - VSL {oferta.vsl} - {oferta.lead} ({oferta.rede})
                  </div>
                  <div className="bg-slate-100 p-4 rounded-md flex items-center justify-between">
                    <p className="font-medium text-blue-600 break-all mr-2">
                      https://mitolyn.com/?afid={getAfidForFunil(oferta.funil)}
                      {/* https://mitolyn.com/{oferta.funil.toLowerCase()}/vsl{oferta.vsl}/?lead={oferta.lead}&affiliate={getAfidForFunil(oferta.funil)} */}
                    </p>
                    <Button
                      onClick={() => handleCopyLink(oferta)}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStage(1)}>Voltar ao Início</Button>
              <Button variant="outline" onClick={() => setStage(2)}>Alterar IDs</Button>
            </CardFooter>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-2 bg-black shadow-sm">
        <div className="mx-auto flex justify-center gap-2 text-center items-center">
          <Image
            src="/logo-gruposix.svg"
            alt="Grupo Six Logo"
            width={70}
            height={40}
            priority
          />
          <p className='text-white font-bold text-5xl'>
            AFILIADOS 🇺🇸</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-4">

        {stage === 1 && (
          <Card className="text-center max-w-4xl mx-auto pt-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Seja bem-vindo à área exclusiva de afiliados!
            </h1>
            <p className="text-gray-600 mx-auto ">
              Nossa plataforma foi desenvolvida para simplificar a geração de links de afiliados,
              permitindo que você gerencie múltiplas ofertas e IDs de forma eficiente.
              Acompanhe as leads mais performáticas e maximize seus resultados.
            </p>
          </Card>

        )}
        <StepsHeader currentStage={stage} />

        <div className="w-full max-w-4xl mx-auto">
          {renderStage()}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>© 2025 Grupo Six. Todos os direitos reservados. Desenvolvido por <a className='text-blue-600 dark:text-blue-500 hover:underline' href="https://github.com/pecraveiro">@pecraveiro</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 