"use client";

import * as React from "react";
import { iconsMetadata } from "@/lib/iconsMetadata";
import { IconMeta } from "@/types/icons";

import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IconSelectorProps {
    category: string;
    showPremium: boolean;
    onSelect: (icon: IconMeta) => void;
    className?: string;
}

export function IconSelector({
    category,
    showPremium,
    onSelect,
}: IconSelectorProps) {
    // 1. Ya no necesitamos el estado de búsqueda manual.
    // const [search, setSearch] = React.useState("");

    // 2. Modificamos useMemo para que SOLO filtre por las props, no por la búsqueda.
    // El filtrado por texto lo hará el componente Command automáticamente.
    const iconsForCategory = React.useMemo(() => {
        return iconsMetadata.filter((icon) => {
            const matchesCategory =
                category === "all" || icon.category === category;
            const matchesPremium = showPremium || !icon.premium;
            return matchesCategory && matchesPremium;
        });
    }, [category, showPremium]); // Dependencias actualizadas

    return (
        <Command>
            {/* 3. Simplificamos CommandInput. Command se encargará de su valor. */}
            <CommandInput placeholder="Buscar elemento" />
            <CommandList>
                <CommandEmpty>No se encontraron elementos.</CommandEmpty>
                <CommandGroup heading="Opciones" className="p-0">
                    <ul className="grid grid-cols-[repeat(auto-fit,_minmax(70px,_1fr))] gap-1 p-2 list-none m-0">
                        {/* Iteramos sobre la lista pre-filtrada */}
                        {iconsForCategory.map((icon) => (
                            <CommandItem
                                key={icon.id}
                                // 4. Añadimos la prop 'value'. Command usará esto para buscar.
                                value={icon.id}
                                onSelect={() => onSelect(icon)}
                                className="flex flex-col items-center justify-center gap-1 p-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="w-8 h-8">
                                    <Image
                                        src={`/icons/${icon.filename}`}
                                        alt={icon.id}
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            </CommandItem>
                        ))}
                    </ul>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}