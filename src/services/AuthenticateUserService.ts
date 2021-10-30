import "dotenv/config"
import axios from 'axios'

/*
  Receive code(str)
  Recove access_token in github
  Check if the user exists in the DB
  - Yes = generate a token;
  - No = create in DB and generate a token
  Return token with user information
*/

interface IAccessTokenResponse {
  access_token: string
}


class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/acces_token"

    const { data: AccessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: "application/json"
      }
    })

    const response = await axios.get("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${AccessTokenResponse.access_token}`
      }
    })

    return response.data
  }
}

export { AuthenticateUserService }