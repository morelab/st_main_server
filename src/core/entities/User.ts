/** @format */

import Device from './Device';
import Profile from './Profile';
import SmartPlug from './SmartPlug';

export default interface User {
  id: string;
  username: string;
  password: string;
  anonymous: boolean;
  name: string;
  priv: number;
  profile: Profile;
  devices: Device[];
  smartPlug: SmartPlug;
}
