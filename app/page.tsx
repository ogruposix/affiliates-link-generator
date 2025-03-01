"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Image from "next/image";

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
  const steps = ["Selecionar Ofertas", "Configurar IDs", "Gerar Links"];

  return (
    <div className="w-full max-w-4xl mx-auto my-4 md:my-8 px-4">
      <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 md:gap-0">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`
              w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center
              ${currentStage > index + 1
                  ? "bg-green-500"
                  : currentStage === index + 1
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }
              text-white text-sm md:text-base font-bold
            `}
            >
              {index + 1}
            </div>
            <span
              className={`
              ml-2 text-sm md:text-base
              ${currentStage === index + 1
                  ? "text-blue-500 font-medium"
                  : "text-gray-500"
                }
            `}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="mx-2 md:mx-4 h-[2px] w-8 md:w-16 bg-gray-300 hidden md:block" />
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
  const [copied, setCopied] = useState("");
  const [ofertasSelecionadas, setOfertasSelecionadas] = useState<string[]>([]);

  const ofertas: OfertaPerformance[] = [
    {
      id: "1",
      funil: "LipoGummies",
      vsl: 4,
      lead: "Lead 2 Microlead 7",
      rede: "Facebook",
      ultimaAtualizacao: "2025-02-28",
    },
    {
      id: "2",
      funil: "SugarSix",
      vsl: 3,
      lead: "Lead 1",
      rede: "Facebook/Youtube",
      ultimaAtualizacao: "2025-02-28",
    },
    {
      id: "3",
      funil: "AlphaGummy",
      vsl: 4,
      lead: "Lead 1",
      rede: "Facebook/Youtube",
      ultimaAtualizacao: "2025-02-28",
    },
    {
      id: "4",
      funil: "FloraLean",
      vsl: 8,
      lead: "Lead 1",
      rede: "Facebook/Youtube",
      ultimaAtualizacao: "2025-02-28",
    },
  ];

  const handleOfertaSelect = (ofertaId: string) => {
    setOfertasSelecionadas((prev) => {
      if (prev.includes(ofertaId)) {
        return prev.filter((id) => id !== ofertaId);
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
        .map((id) => ofertas.find((o) => o.id === id)?.funil)
        .filter((funil): funil is string => funil !== undefined)
    );
    return Array.from(funilsUnicos);
  };

  const getAfidForFunil = (funil: string) => {
    return affiliateIds.find((a) => a.funil === funil)?.afid || "";
  };

  const handleAfidChange = (funil: string, afid: string) => {
    setAffiliateIds((prev) => {
      const filtered = prev.filter((a) => a.funil !== funil);
      return [...filtered, { funil, afid }];
    });
  };

  const handleSubmitAfids = (e: React.FormEvent) => {
    e.preventDefault();
    const funilsSelecionados = getFunilsSelecionados();
    const todosPreenchidos = funilsSelecionados.every((funil) =>
      getAfidForFunil(funil)
    );

    if (todosPreenchidos) {
      setStage(3);
    }
  };

  const handleCopyLink = (ofertaId: string) => {
    const oferta = ofertas.find((o) => o.id === ofertaId);

    if (!oferta) {
      return;
    }

    const afid = getAfidForFunil(oferta.funil);
    if (afid) {
      let linkToCopy = "";

      if (oferta.funil === "LipoGummies") {
        if (oferta.lead.includes("Lead 2 Microlead 7")) {
          linkToCopy = `https://sixminutewellness.com/lipo/afi/vsl4/h1l2m7?afid=${afid}`;
        }
      } else if (oferta.funil === "SugarSix") {
        linkToCopy = `https://sixminutewellness.com/sugar/afi/vsl3/h1l1?afid=${afid}`;
      } else if (oferta.funil === "AlphaGummy") {
        linkToCopy = `https://sixminutewellness.com/alpha/afi/vsl4/h1l1?afid=${afid}`;
      } else if (oferta.funil === "FloraLean") {
        linkToCopy = `https://sixminutewellness.com/flora/afi/vsl8/h1l1?afid=${afid}`;
      }

      navigator.clipboard.writeText(linkToCopy);
      setCopied(ofertaId);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <h2 className="text-xl md:text-2xl font-bold">
                Selecione as Ofertas Performáticas
              </h2>
              <CardDescription className="text-sm md:text-base">
                Escolha as ofertas que deseja disponibilizar para o afiliado com
                base nas leads mais performáticas por rede.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Selecionar</TableHead>
                    <TableHead>Funil</TableHead>
                    <TableHead className="">VSL</TableHead>
                    <TableHead className="">Lead</TableHead>
                    <TableHead>Rede</TableHead>
                    <TableHead className="">Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ofertas.map((oferta) => (
                    <TableRow key={oferta.id}>
                      <TableCell>
                        <Checkbox
                          className="w-4 h-4 border-gray-400"
                          checked={ofertasSelecionadas.includes(oferta.id)}
                          onCheckedChange={() => handleOfertaSelect(oferta.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {oferta.funil}
                      </TableCell>
                      <TableCell className="">{oferta.vsl}</TableCell>
                      <TableCell className="">{oferta.lead}</TableCell>
                      <TableCell>{oferta.rede}</TableCell>
                      <TableCell className="">
                        {new Date(oferta.ultimaAtualizacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs md:hidden mt-2">Arraste para o lado para ver todas as especificações</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="cursor-pointer"
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
              <CardTitle className="text-xl md:text-2xl font-bold">
                Configure os IDs de Afiliado
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Digite o ID de afiliado específico para cada funil selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAfids} className="space-y-4 md:space-y-6">
                {funilsSelecionados.map((funil) => (
                  <div key={funil} className="space-y-2">
                    <label className="text-sm md:text-base font-medium">
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
                  className="w-full cursor-pointer"
                  disabled={
                    !funilsSelecionados.every((funil) => getAfidForFunil(funil))
                  }
                >
                  Gerar Links
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 3:
        const ofertasSelecionadasDetalhes = ofertas.filter((o) =>
          ofertasSelecionadas.includes(o.id)
        );

        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Links Gerados
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Seus links de afiliado para as ofertas selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {ofertasSelecionadasDetalhes.map((oferta) => {
                let linkDisplay = "";
                const afid = getAfidForFunil(oferta.funil);

                if (oferta.funil === "LipoGummies") {
                  if (oferta.lead.includes("Lead 2 Microlead 7")) {
                    linkDisplay = `https://sixminutewellness.com/lipo/afi/vsl4/h1l2m7?afid=${afid}`;
                  }
                } else if (oferta.funil === "SugarSix") {
                  linkDisplay = `https://sixminutewellness.com/sugar/afi/vsl3/h1l1?afid=${afid}`;
                } else if (oferta.funil === "AlphaGummy") {
                  linkDisplay = `https://sixminutewellness.com/alpha/afi/vsl4/h1l1?afid=${afid}`;
                } else if (oferta.funil === "FloraLean") {
                  linkDisplay = `https://sixminutewellness.com/flora/afi/vsl8/h1l1?afid=${afid}`;
                }

                return (
                  <div key={oferta.id} className="space-y-2">
                    <div className="text-sm md:text-base font-bold">
                      {oferta.funil} - VSL {oferta.vsl} - {oferta.lead} ({oferta.rede})
                    </div>
                    <div className="bg-slate-100 p-2 md:p-4 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                      <p className="text-sm font-medium text-blue-600 break-all hiv">
                        {linkDisplay}
                      </p>
                      <Button
                        onClick={() => handleCopyLink(oferta.id)}
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto cursor-pointer"
                      >
                        {copied && copied == oferta.id ? (
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
                );
              })}
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row gap-2 justify-between">
              <Button variant="outline" onClick={() => setStage(2)} className="w-full md:w-auto">
                Alterar IDs
              </Button>
              <Button variant="outline" onClick={() => setStage(1)} className="w-full md:w-auto">
                Voltar ao Início
              </Button>
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
      <header className="w-full p-2 md:p-4 bg-black shadow-sm">
        <div className="mx-auto flex justify-center gap-2 text-center items-center">
          <Image
            src="/logo-gruposix.svg"
            alt="Grupo Six Logo"
            width={50}
            height={30}
            className="md:w-[70px] md:h-[40px]"
            priority
          />
          <p className="text-white font-bold text-2xl md:text-5xl">AFILIADOS 🇺🇸</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-4 md:py-8 px-4">
        {stage === 1 && (
          <Card className="text-center max-w-4xl mx-auto p-4">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
              Seja bem-vindo à área exclusiva de afiliados!
            </h1>
            <p className="text-sm md:text-base text-gray-600 mx-auto mt-2">
              Nossa plataforma foi desenvolvida para simplificar a geração de
              links de afiliados, permitindo que você gerencie múltiplas ofertas
              e IDs de forma eficiente. Acompanhe as leads mais performáticas e
              maximize seus resultados.
            </p>
          </Card>
        )}
        <StepsHeader currentStage={stage} />

        <div className="w-full max-w-4xl mx-auto">{renderStage()}</div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 md:py-6 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto text-center text-gray-600 px-4">
          <p className="text-sm md:text-base">
            © 2025 Grupo Six. Todos os direitos reservados. Desenvolvido por{" "}
            <a
              className="text-blue-600 dark:text-blue-500 hover:underline"
              href="https://github.com/pecraveiro"
            >
              @pecraveiro
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
