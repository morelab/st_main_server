/** @format */

import { Request, Response } from 'express';
import { authenticationCookieName } from '../configuration/configuration';
import {
  DeleteProfileInteractor,
  GetProfileInteractor,
  PrivacyInteractor,
} from '../core/interactors';
import { InteractorResponse } from '../shared/entities/Responses';
import { CODE_OK } from '../utils/httpCodes';

export const getProfileController = async (
  request: Request,
  response: Response,
) => {
  const { cookies } = request;
  const token: string = cookies[authenticationCookieName];
  const interactorResponse: InteractorResponse = await GetProfileInteractor(
    token,
  );
  response.status(interactorResponse.statusCode).send(interactorResponse.value);
};

export const deleteProfileController = async (
  request: Request,
  response: Response,
) => {
  const { cookies } = request;
  const token: string = cookies[authenticationCookieName];
  const interactorResponse: InteractorResponse = await DeleteProfileInteractor(
    token,
  );
  if (interactorResponse.statusCode === CODE_OK) {
    response.clearCookie(authenticationCookieName);
  }
  response.status(interactorResponse.statusCode).json(interactorResponse.value);
};
export const privacyController = async (
  request: Request,
  response: Response,
) => {
  const { cookies } = request;
  const token: string = cookies[authenticationCookieName];
  const interactorResponse: InteractorResponse = await PrivacyInteractor(token);
  response.status(interactorResponse.statusCode).send(interactorResponse.value);
};
