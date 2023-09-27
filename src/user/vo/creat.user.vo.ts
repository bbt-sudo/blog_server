export class UserInfoVo {
  id: string;

  user_account: string;

  email: string;

  phone: number;

  nick_Name: string;

  head_Sculpture: string;
  isFrozen: boolean;
  isAdmin: boolean;

  created_Time: Date;

  updated_Time: Date;

  roles: string[];

  permissions: string[];
}
export class CreateUserVo {
  user: UserInfoVo;
}

export class LoginUserVo {
  userInfo: UserInfoVo;
  accessToken: string;
  refreshToken: string;
}
