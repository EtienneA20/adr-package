import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { VisuallyHidden } from "./visually-hidden";

describe("VisuallyHidden", () => {
  it("rend son contenu dans le DOM", () => {
    render(<VisuallyHidden>Texte masqué</VisuallyHidden>);

    expect(screen.getByText("Texte masqué")).toBeInTheDocument();
  });

  it("masque visuellement le contenu sans le retirer de l'arbre d'accessibilité", () => {
    render(<VisuallyHidden>Texte masqué</VisuallyHidden>);
    const element = screen.getByText("Texte masqué");

    expect(element).toHaveStyle({
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
    });
    expect(element).not.toHaveStyle({ display: "none" });
    expect(element).toBeVisible();
  });

  it("donne un nom accessible à un bouton qui ne contient qu'une icône", () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Fermer la fenêtre</VisuallyHidden>
      </button>,
    );

    expect(screen.getByRole("button", { name: "Fermer la fenêtre" })).toBeInTheDocument();
  });

  it("laisse le bouton qui le contient cliquable", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    render(
      <button type="button" onClick={onClick}>
        <VisuallyHidden>Fermer la fenêtre</VisuallyHidden>
      </button>,
    );

    await user.click(screen.getByRole("button", { name: "Fermer la fenêtre" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("peut servir de description accessible via son id", () => {
    render(
      <>
        <input type="text" aria-label="Mot de passe" aria-describedby="hint" />
        <VisuallyHidden id="hint">12 caractères minimum</VisuallyHidden>
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Mot de passe" })).toHaveAccessibleDescription(
      "12 caractères minimum",
    );
  });

  it("rend un élément vide quand il n'a pas de contenu", () => {
    const { container } = render(<VisuallyHidden>{null}</VisuallyHidden>);

    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });
});
