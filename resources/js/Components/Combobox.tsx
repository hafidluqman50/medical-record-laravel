import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
 
import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/Components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"

import { Button } from '@/Components/ui/button'

type ComboboxProps = {
    data:any
    placeholder:string
    nextRef?: any
    onValueChange?: CallableFunction
    defaultValue?: number|string|null
}

const Combobox = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<ComboboxProps>
>(({data, placeholder, nextRef, onValueChange = () => {}, defaultValue = null}, ref) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [valueSelect, setValueSelect] = React.useState<string|number|null>(defaultValue ?? "")
  
  const check = defaultValue == null ? valueSelect : defaultValue.toString()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {
            check != ''
            ? data.find((value: any) => value.id.toString() === check)?.name
            : `Pilih ${placeholder} ...`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={`Cari ${placeholder} ...`} className="h-9" />
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup>
            {data.map((value: any) => (
              <CommandItem
                key={value.id}
                value={`${value.name}|${value.id.toString()}`}
                onSelect={(currentValue) => {
                  const strSlice = currentValue.split('|')
                  setValueSelect(strSlice[1])
                  setOpen(false)
                  onValueChange(parseInt(strSlice[1]))
                  nextRef?.current.focus()
                }}
              >
                {value.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    check === value.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

Combobox.displayName = "Combobox"

export {
    Combobox
}