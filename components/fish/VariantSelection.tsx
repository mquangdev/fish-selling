"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface VariantSelection {
  /** Id of the selected variant, or null when none is selected. */
  selectedId: string | null;
  select: (id: string | null) => void;
}

const VariantSelectionContext = createContext<VariantSelection>({
  selectedId: null,
  select: () => {},
});

/** Shares the selected variant between the gallery and the variants list. */
export function VariantSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <VariantSelectionContext.Provider
      value={{ selectedId, select: setSelectedId }}
    >
      {children}
    </VariantSelectionContext.Provider>
  );
}

export function useVariantSelection(): VariantSelection {
  return useContext(VariantSelectionContext);
}
