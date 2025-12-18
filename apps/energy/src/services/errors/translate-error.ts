import { msg } from '@lingui/core/macro';
import { ErrorMessage } from '@/utils/error';

export const translateError = (error: ErrorMessage) => {
  switch (error) {
    case ErrorMessage.InvalidCredentials: {
      return msg`It doesn't look like a user exists with the credentials you provided.`;
    }
    case ErrorMessage.UserAlreadyExists: {
      return msg`A user with this email address and/or username already exists.`;
    }
    case ErrorMessage.SecretsNotFound: {
      return msg`User does not have an associated 'secrets' record. Please report this issue on GitHub.`;
    }
    case ErrorMessage.OAuthUser: {
      return msg`This email address is associated with an OAuth account. Please sign in with your OAuth provider.`;
    }
    case ErrorMessage.InvalidResetToken: {
      return msg`It looks like the reset token you provided is invalid. Please try restarting the password reset process again.`;
    }
    case ErrorMessage.InvalidVerificationToken: {
      return msg`It looks like the verification token you provided is invalid. Please try restarting the verification process again.`;
    }
    case ErrorMessage.EmailAlreadyVerified: {
      return msg`It looks like your email address has already been verified.`;
    }
    case ErrorMessage.SomethingWentWrong: {
      return msg`Something went wrong while processing your request. Please try again later or raise an issue on GitHub.`;
    }

    default: {
      return null;
    }
  }
};
