/** @format */

export interface VerifiedToken {
  iss: string;
  sub: string;
  exp: number;
  data: string;
  iat: number;
}
