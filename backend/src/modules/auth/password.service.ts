import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

/**
 * Argon2id password hashing (OWASP-recommended). Parameters are deliberately
 * above the minimums; tune only with a benchmark on the production host.
 */
@Injectable()
export class PasswordService {
  private readonly opts = {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MiB
    timeCost: 2,
    parallelism: 1,
  } as const;

  // Real hash computed once, used to equalize login timing for unknown emails
  // so the endpoint cannot be used to enumerate which accounts exist.
  private dummyHashPromise?: Promise<string>;

  hash(plain: string): Promise<string> {
    return argon2.hash(plain, this.opts);
  }

  verify(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain).catch(() => false);
  }

  /** Runs a real verify against a throwaway hash to burn equivalent CPU time. */
  async verifyDummy(plain: string): Promise<false> {
    this.dummyHashPromise ??= this.hash('timing-equalization-placeholder');
    await this.verify(await this.dummyHashPromise, plain);
    return false;
  }
}
