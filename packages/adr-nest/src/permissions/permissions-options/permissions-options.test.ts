import type { ExecutionContext } from "@nestjs/common";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { IPermissionSubject } from "../permission-rule";
import {
  type IPermissionsModuleOptions,
  PERMISSIONS_OPTIONS,
  type SubjectResolver,
} from "./permissions-options";

describe("options de PermissionsModule", () => {
  it("acceptent une fonction subject synchrone ou asynchrone", () => {
    const options: IPermissionsModuleOptions = {
      permissions: { roles: {} },
      subject: () => Promise.resolve({ roles: ["member"] }),
      strict: false,
    };

    expect(options.strict).toBe(false);
    expectTypeOf<() => IPermissionSubject | null>().toExtend<SubjectResolver>();
    expectTypeOf<SubjectResolver>().parameter(0).toEqualTypeOf<ExecutionContext>();
  });

  it("utilisent un jeton d'injection unique", () => {
    expect(typeof PERMISSIONS_OPTIONS).toBe("symbol");
  });
});
