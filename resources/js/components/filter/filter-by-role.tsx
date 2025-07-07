import * as React from "react";
import { Check, CheckIcon, ChevronsUpDown, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Role } from "@/types";

interface FilterProps {
    roles: Role[];
    value: string; // ubah dari number | null → string
    onValueChange: (value: string) => void; // string selalu
}

export function FilterByRole({ roles, value, onValueChange }: FilterProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? roles.find((role) => role.id.toString() === value)?.name
                        : <span className="text-neutral-400">Pilih Role...</span>}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Cari Role..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="Semua"
                                onSelect={() => {
                                    onValueChange("" === value ? "" : "")
                                    setOpen(false)
                                }}
                            >
                                Semua
                                <Check
                                    className={cn(
                                        "ml-auto",
                                        value === "" ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                            {roles && roles.length > 0 && roles.map((role) => (
                                <CommandItem
                                    key={role.id}
                                    value={role.name}
                                    onSelect={() => {
                                        onValueChange(role.id.toString() === value ? "" : role.id.toString())
                                        setOpen(false)
                                    }}
                                >
                                    {role.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === role.id.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
