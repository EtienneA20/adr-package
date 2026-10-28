import type { CSSProperties, ReactElement, ReactNode } from "react";

/**
 * Props du composant {@link VisuallyHidden}.
 *
 * @example
 * ```tsx
 * const props: IVisuallyHiddenProps = { children: "Fermer la fenêtre", id: "close-label" };
 * ```
 * @since 0.1.0
 */
export interface IVisuallyHiddenProps {
  /** Contenu lu par les technologies d'assistance mais invisible à l'écran. */
  children: ReactNode;
  /** Identifiant HTML, pour référencer le texte depuis `aria-describedby` ou `aria-labelledby`. */
  id?: string;
}

// Technique « sr-only » : `display: none` ou `visibility: hidden` retireraient aussi le texte
// de l'arbre d'accessibilité ; on le réduit donc à 1 px, rogné et hors du flux.
const HIDDEN_STYLE: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Masque visuellement un contenu tout en le laissant accessible aux lecteurs d'écran.
 *
 * À utiliser pour donner un nom accessible à un bouton qui ne contient qu'une icône, ou pour
 * ajouter une précision utile uniquement aux technologies d'assistance. Ne pas l'utiliser pour
 * cacher un contenu à tout le monde (préférer un rendu conditionnel).
 *
 * @param props - Props du composant, voir {@link IVisuallyHiddenProps}.
 * @returns Un `<span>` invisible à l'écran contenant `children`.
 * @example
 * ```tsx
 * <button type="button" onClick={onClose}>
 *   <CloseIcon aria-hidden />
 *   <VisuallyHidden>Fermer la fenêtre</VisuallyHidden>
 * </button>
 * ```
 * @since 0.1.0
 */
export function VisuallyHidden({ children, id }: IVisuallyHiddenProps): ReactElement {
  return (
    <span id={id} style={HIDDEN_STYLE}>
      {children}
    </span>
  );
}
