/** @format */

import { Request, Response } from 'express';
import { authenticationCookieName } from '../configuration/configuration';
import {
  SmartPlugValidationInteractor,
  UserCookieValidationInteractor as userCookieValidation,
} from '../core/interactors';
import { InteractorResponse } from '../shared/entities/Responses';
import { CODE_OK } from '../utils/httpCodes';

export const smartPlugValidationController = async (
  request: Request,
  response: Response,
) => {
  const { body } = request;
  const { location } = body;
  const interactorResponse: InteractorResponse = await SmartPlugValidationInteractor(
    location,
  );
  if (interactorResponse.statusCode !== CODE_OK) {
    response
      .status(interactorResponse.statusCode)
      .json(interactorResponse.value);
  }
  response.status(200).json({ alias: interactorResponse.value });
};

export const userCookieValidationController = async (
  request: Request,
  response: Response,
) => {
  const { cookies } = request;
  const token = cookies[authenticationCookieName];
  const interactorResponse: InteractorResponse = userCookieValidation(token);
  response.status(interactorResponse.statusCode).json(interactorResponse.value);
};
