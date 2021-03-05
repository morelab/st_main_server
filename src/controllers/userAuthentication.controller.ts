/** @format */

import { Request, Response } from 'express';
import { authenticationCookieName } from '../configuration/configuration';
import {
  LogInInteractor as logIn,
  SignUpInteractor as signUp,
} from '../core/interactors';
import { InteractorResponse } from '../shared/entities/Responses';
import { CODE_OK } from '../utils/httpCodes';

export const logInController = async (request: Request, response: Response) => {
  const { body } = request;
  const { user, pass } = body;
  const interactorResponse: InteractorResponse = await logIn(user, pass);
  if (interactorResponse.statusCode !== CODE_OK) {
    response
      .status(interactorResponse.statusCode)
      .json(interactorResponse.value);
  } else {
    response.cookie(authenticationCookieName, interactorResponse.value, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });
    response.status(interactorResponse.statusCode).json({ success: true });
  }
};

export const signUpController = async (
  request: Request,
  response: Response,
) => {
  const { body } = request;
  const {
    user,
    pass,
    anonymous,
    name,
    priv,
    profile,
    devices,
    smartplug,
  } = body;

  const interactorResponse: InteractorResponse = await signUp(
    user,
    pass,
    anonymous,
    name,
    priv,
    profile,
    devices,
    smartplug,
  );
  if (interactorResponse.statusCode !== CODE_OK) {
    response
      .status(interactorResponse.statusCode)
      .json(interactorResponse.value);
  } else {
    response.cookie(authenticationCookieName, interactorResponse.value, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });
    response.status(200).json({ success: true });
  }
};

export const deleteCookie = async (_request: Request, response: Response) => {
  response.clearCookie(authenticationCookieName);
  response.status(200).json({ success: true });
};
