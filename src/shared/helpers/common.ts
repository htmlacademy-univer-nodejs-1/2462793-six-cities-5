import {ClassConstructor, plainToInstance} from 'class-transformer';
import * as jose from 'jose';
import {TokenPayload} from '../../types/index.js';
import * as crypto from 'node:crypto';
import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../libs/rest/index.js';
import {ApplicationError} from '../libs/rest/types/application-error.enum.js';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDto<T, V>(dto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(dto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return {errorType, error, details};
}

export async function createJWT(algorithm: string, jwtSecret: string, payload: TokenPayload): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
