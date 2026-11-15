import { describe, expect, it } from "vitest";

import {
  DEFAULT_EXPORT_MAX_ROWS,
  ExportLimitExceededException,
  assertExportSize,
  limitExportRows,
} from "./export-limit";
import { ApiException } from "../../common";

async function collect<T>(rows: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const row of rows) result.push(row);
  return result;
}

async function* generate(count: number): AsyncGenerator<number> {
  for (let index = 0; index < count; index += 1) yield await Promise.resolve(index);
}

describe("ExportLimitExceededException", () => {
  it("produit une 400 EXPORT_LIMIT_EXCEEDED en français", () => {
    const exception = new ExportLimitExceededException(50_000);
    expect(exception).toBeInstanceOf(ApiException);
    expect(exception.maxRows).toBe(50_000);
    expect(exception.getResponse()).toMatchObject({
      status: 400,
      code: "EXPORT_LIMIT_EXCEEDED",
      title: "Export trop volumineux",
    });
    expect(exception.getResponse().detail).toMatch(/^L'export est limité à 50\s000 lignes/);
  });
});

describe("assertExportSize", () => {
  it("accepte la limite exacte et refuse au-delà", () => {
    expect(() => {
      assertExportSize(DEFAULT_EXPORT_MAX_ROWS);
    }).not.toThrow();
    expect(() => {
      assertExportSize(DEFAULT_EXPORT_MAX_ROWS + 1);
    }).toThrow(ExportLimitExceededException);
    expect(() => {
      assertExportSize(11, 10);
    }).toThrow(ExportLimitExceededException);
  });
});

describe("limitExportRows", () => {
  it("transmet les lignes d'un tableau ou d'un itérable asynchrone", async () => {
    await expect(collect(limitExportRows([1, 2], 2))).resolves.toEqual([1, 2]);
    await expect(collect(limitExportRows(generate(3)))).resolves.toEqual([0, 1, 2]);
  });

  it("s'interrompt dès que la limite est dépassée, sans lire la suite", async () => {
    const read: number[] = [];
    async function* source(): AsyncGenerator<number> {
      for (let index = 0; index < 1000; index += 1) {
        read.push(index);
        yield await Promise.resolve(index);
      }
    }
    await expect(collect(limitExportRows(source(), 3))).rejects.toBeInstanceOf(
      ExportLimitExceededException,
    );
    expect(read).toHaveLength(4);
  });
});
