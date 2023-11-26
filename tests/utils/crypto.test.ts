import { hashString, verifyString, hashPassword, verifyPassword, generateCode } from '../../src/utils/crypto';
import { createHash } from 'crypto';

describe('Hashing and Verification Functions', () => {
  const originalString = 'hello123';
  let hashedString = '';

  beforeAll(() => {
    hashedString = createHash('sha256').update(originalString).digest('hex');
  });

  it('should hash a string', () => {
    const hash = hashString(originalString);
    expect(hash).toEqual(hashedString);
  });

  it('should verify a correct string', () => {
    const isVerified = verifyString(originalString, hashedString);
    expect(isVerified).toBe(true);
  });

  it('should not verify an incorrect string', () => {
    const isVerified = verifyString('incorrect_string', hashedString);
    expect(isVerified).toBe(false);
  });

  it('should hash a string with a different algorithm (MD5)', () => {
    const md5Hash = createHash('md5').update(originalString).digest('hex');
    const hash = hashString(originalString, 'md5');
    expect(hash).toEqual(md5Hash);
  });
});

describe('Password Hashing and Verification Functions', () => {
  const originalPassword = 'securePassword123';
  let hashedPassword = '';

  beforeAll(() => {
    hashedPassword = hashPassword(originalPassword);
  });

  it('should hash a password', () => {
    const hash = hashPassword(originalPassword);
    expect(hash).toEqual(hashedPassword);
  });

  it('should verify a correct password', () => {
    const isVerified = verifyPassword(originalPassword, hashedPassword);
    expect(isVerified).toBe(true);
  });

  it('should not verify an incorrect password', () => {
    const isVerified = verifyPassword('incorrect_password', hashedPassword);
    expect(isVerified).toBe(false);
  });

  it('should hash a password with a different secret key', () => {
    const differentSecretKey = 'different_secret_key_here';
    const hash = hashString(originalPassword + differentSecretKey);
    expect(hash).not.toEqual(hashedPassword);
  });
});

describe('Random Code Generation Function', () => {
  it('should generate a 6-digit code', () => {
    const code = generateCode();
    expect(code.length).toBe(6);
    expect(Number.isNaN(Number(code))).toBe(false);
  });

  it('should generate a different code on each call', () => {
    const code1 = generateCode();
    const code2 = generateCode();
    expect(code1).not.toEqual(code2);
  });

  it('should generate numeric code', () => {
    const code = generateCode();
    const codeNumber = parseInt(code);
    expect(Number.isNaN(codeNumber)).toBe(false);
  });
});
