/** @format */

import { Request, Response } from 'express';
import { authenticationCookieName } from '../configuration/configuration';
import {
  DashboardInteractor,
  SmartPlugCommandInteractor,
} from '../core/interactors';
import { InteractorResponse } from '../shared/entities/Responses';

export const dashboardController = async (
  request: Request,
  response: Response,
) => {
  const { cookies } = request;
  const token = cookies[authenticationCookieName];
  const interactorResponse: InteractorResponse = await DashboardInteractor(
    token,
  );
  response.status(interactorResponse.statusCode).json(interactorResponse.value);
};

export const smartPlugCommand = async (
  request: Request,
  response: Response,
) => {
  const { cookies } = request;
  const token = cookies[authenticationCookieName];
  const interactorResponse: InteractorResponse = await SmartPlugCommandInteractor(
    token,
  );
  response.status(interactorResponse.statusCode).json(interactorResponse.value);
};
