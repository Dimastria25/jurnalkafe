"use client";

import clsx from "clsx";

type Option = { value: string; label: string; emoji?: string };

export function ChipMultiSelect({
  options,
  value,
  onChange,
}: {
  options: readonly Option[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(v: string) {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={clsx(
              "px-3.5 py-2 rounded-full text-sm font-medium border transition-all active:scale-95",
              active
                ? "bg-coffee text-cream border-coffee shadow-sm"
                : "bg-paper text-espresso-soft border-line hover:border-coffee-light"
            )}
          >
            {opt.emoji ? `${opt.emoji} ` : ""}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ChipSingleSelect({
  options,
  value,
  onChange,
}: {
  options: readonly Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "px-3.5 py-2 rounded-full text-sm font-medium border transition-all active:scale-95",
              active
                ? "bg-crema text-espresso border-crema shadow-sm"
                : "bg-paper text-espresso-soft border-line hover:border-coffee-light"
            )}
          >
            {opt.emoji ? `${opt.emoji} ` : ""}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
