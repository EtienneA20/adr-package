<!-- Généré par `pnpm run install:skills` à partir de packages/adr-react/SKILLS.md, ne pas modifier à la main. -->

# SKILLS : @etiennea20/adr-react

## Introduction

Bibliothèque de composants et de hooks React (≥ 18) publiée sur GitHub Packages.

- Point d'entrée principal : `@etiennea20/adr-react` (aucune dépendance hors React).
- Les catégories qui dépendent d'une peerDependency optionnelle ont leur propre sous-chemin :
  `@etiennea20/adr-react/fetch` (axios, @tanstack/react-query) et
  `@etiennea20/adr-react/routing` (react-router).
- Tous les modules sont marqués `"use client"` (compatibles React Server Components).

## Table des matières

_Aucun élément public pour l'instant._
