"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { MdOutlineContentCopy } from "react-icons/md";

interface AdomData {
    name: string;
    total: number;
}

interface FortiWebData {
    name: string;
    adoms: AdomData[];
    total: number;
}

interface CrpItem {
    crp: string;
    server: string;
}

interface AdomModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCard: FortiWebData | null;
}

const AdomModal: React.FC<AdomModalProps> = ({ isOpen, onClose, selectedCard }) => {
    const [search, setSearch] = useState("");
    const [searchCrp, setSearchCrp] = useState('');
    const [selectedAdom, setSelectedAdom] = useState<AdomData | null>(null);
    const [selectedAdomCrps, setSelectedAdomCrps] = useState<CrpItem[] | null>(null);
    const [loadingCrps, setLoadingCrps] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Fecha ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    // Filtragem otimizada para ADOMs
    const filteredAdoms = useMemo(() => {
        if (!selectedCard) return [];
        const term = search.toLowerCase().trim();
        return [...selectedCard.adoms]
            .sort((a, b) => b.total - a.total)
            .filter((adom) => adom.name.toLowerCase().includes(term));
    }, [selectedCard, search]);

    // Filtragem otimizada para CRPs
    const filteredCrps = useMemo(() => {
        if (!selectedAdomCrps) return [];
        const term = searchCrp.toLowerCase().trim();
        if (!term) return selectedAdomCrps;
        
        return selectedAdomCrps.filter((crp) => 
            crp.crp.toLowerCase().includes(term) || 
            crp.server.toLowerCase().includes(term)
        );
    }, [selectedAdomCrps, searchCrp]);

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Falha ao copiar texto: ', err);
        }
    };

    if (!isOpen || !selectedCard) return null;

    const fetchCrps = async (adom: AdomData) => {
        setLoadingCrps(true);
        setSelectedAdom(adom);
        setSelectedAdomCrps(null);
        setSearchCrp(''); // Limpa a busca de CRPs quando seleciona nova ADOM

        try {
            const response = await fetch(
                `http://localhost:8080/crp?adom=${encodeURIComponent(adom.name)}`
            );
            const data = await response.json();
            setSelectedAdomCrps(data.results || []);
        } catch (error) {
            console.error("Erro ao buscar CRPs da ADOM:", error);
            setSelectedAdomCrps([]);
        } finally {
            setLoadingCrps(false);
        }
    };

    const clearSelection = () => {
        setSelectedAdom(null);
        setSelectedAdomCrps(null);
        setSearchCrp('');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col"
            >
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">{selectedCard?.name}</h3>
                            <p className="text-sm text-gray-400">Total: {selectedCard?.total} sites</p>
                        </div>
                        {selectedAdom && (
                            <button
                                onClick={clearSelection}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
                            >
                                Voltar
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="text-xl text-white hover:text-gray-300">
                        <IoClose />
                    </button>
                </div>

                {/* Campo de busca */}
                <div className="relative mb-4">
                    <CiSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Buscar ADOM..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Conteúdo lado a lado */}
                <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
                    {/* Lista de ADOMs */}
                    <div className="flex flex-col w-1/2 min-w-0 overflow-hidden">
                        <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">
                            ADOMs ({filteredAdoms.length})
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                            {filteredAdoms.length > 0 ? (
                                filteredAdoms.map((adom, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => fetchCrps(adom)}
                                        className={`flex justify-between items-center p-3 rounded-lg border transition-all w-full text-left group
                  ${selectedAdom?.name === adom.name
                                                ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20'
                                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-sm font-medium truncate block ${selectedAdom?.name === adom.name ? 'text-white' : 'text-slate-200'}`}
                                                title={adom.name}>
                                                {adom.name}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold px-2 py-1 rounded-lg min-w-12 text-center transition-colors
                  ${selectedAdom?.name === adom.name
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-800 text-blue-300 group-hover:bg-gray-700'
                                            }`}>
                                            {adom.total}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="text-gray-400 text-center py-8">Nenhum ADOM encontrado</div>
                            )}
                        </div>
                    </div>

                    {/* Lista de CRPs */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wide text-gray-400">
                                {selectedAdom ? `Policies - ${selectedAdom.name}` : 'Selecione uma ADOM'}
                            </h4>
                            {selectedAdomCrps && (
                                <span className="text-xs text-gray-400">
                                    {filteredCrps.length} de {selectedAdomCrps.length} policies
                                </span>
                            )}
                        </div>

                        {/* Campo de busca para CRPs */}
                        {selectedAdom && (
                            <div className="relative mb-4">
                                <CiSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Buscar por policy ou servidor..."
                                    value={searchCrp}
                                    onChange={(e) => setSearchCrp(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto pr-2">
                            {loadingCrps ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : filteredCrps && filteredCrps.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredCrps.map((crp, idx) => (
                                        <div key={idx} className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors group relative">
                                            <button
                                                onClick={() => copyToClipboard(`${crp.crp} - ${crp.server}`, idx)}
                                                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-gray-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Copiar policy"
                                            >
                                                <MdOutlineContentCopy className="text-lg" />
                                            </button>
                                            {copiedIndex === idx && (
                                                <div className="absolute top-3 right-12 bg-green-600 text-white text-xs px-2 py-1 rounded-lg">
                                                    Copiado!
                                                </div>
                                            )}
                                            <div className="text-sm font-semibold text-white truncate mb-1 pr-10">{crp.crp}</div>
                                            <div className="text-xs text-gray-300">
                                                <span className="text-gray-400">Servidor: </span>
                                                {crp.server}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400 text-center py-8 bg-gray-700 rounded-lg border border-gray-600">
                                    {selectedAdom 
                                        ? searchCrp 
                                            ? 'Nenhuma policy encontrada para esta busca' 
                                            : 'Nenhum CRP encontrado para esta ADOM' 
                                        : 'Selecione uma ADOM para visualizar as policies'
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-xs text-gray-400">
                    <span>ADOM selecionada: {selectedAdom?.name || 'Nenhuma'}</span>
                    {selectedAdomCrps && (
                        <span>Policies encontradas: {filteredCrps.length}</span>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdomModal;