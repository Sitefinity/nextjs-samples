'use client';

import { useSearchParams } from 'next/navigation';
import { RegistrationCaptchaV3Client } from './registration-captcha-v3.client';
import { RegistrationEntity, RegistrationViewProps, ActivationClient } from '@progress/sitefinity-nextjs-sdk/widgets';
import { useEffect, useMemo, useState } from 'react';
import { RestClient, ErrorCodeException } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { getQueryParams } from '@progress/sitefinity-nextjs-sdk/widgets';

const EncryptedParam = 'qs';
export function RegistrationCaptchaV3View(props: RegistrationViewProps<RegistrationEntity>) {
  const entity = props.widgetContext.model.Properties;
  const context = props.widgetContext.requestContext;
  const searchParams = useSearchParams();
  const queryParams = useMemo(() => {
    return getQueryParams(searchParams);
  }, [searchParams]);

  const labels = props.labels;
  const showSuccessMessage = useMemo(() => {
    return getQueryParams(searchParams).showSuccessMessage?.toLowerCase() === 'true';
  }, [searchParams]);

  const isAccountActivationRequest = useMemo(() => {
    if (context?.isLive && queryParams && queryParams[EncryptedParam]) {
      return true;
    }

    return false;
  }, [context?.isLive, queryParams]);

  const [activationTitle, setActivationTitle] = useState<string>();
  const [activationLabel, setActivationLabel] = useState<string>();
  const [isActivationError, setIsActivationError] = useState<boolean>(false);
  const [isActivationExpired, setIsActivationExpired] = useState<boolean>(false);
  useEffect(() => {
    if (isAccountActivationRequest) {
      RestClient.activateAccount(queryParams[EncryptedParam]).then(() => {
        setActivationTitle(entity.ActivationMessage);
      }).catch((error) => {
        if (error instanceof ErrorCodeException && error.code === 'Gone') {
          setIsActivationExpired(true);
          props.email = error.message;
        } else {
          setIsActivationError(true);
          setActivationTitle(entity.ActivationFailTitle);
          setActivationLabel(entity.ActivationFailLabel);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountActivationRequest]);

  return (
    <>
      <div
        {...props.attributes}
      >
        {isActivationExpired &&
          <>
            <ActivationClient
              action={props.resendConfirmationEmailHandlerPath}
              viewProps={props}
            />
          </>}

        {(isAccountActivationRequest && !isActivationExpired) && <h2 className="mb-3">
          {activationTitle}
        </h2>
        }
        {isActivationError && <p>{activationLabel}</p>
        }
        {!isAccountActivationRequest && (<>
          {showSuccessMessage && <h3>{labels.successHeader}</h3>}
          {showSuccessMessage && <p>{labels.successLabel}</p>}
          {
            !showSuccessMessage &&
            <>

              <RegistrationCaptchaV3Client
                action={props.registrationHandlerPath}
                viewProps={props}
              />
            </>
          }
        </>)
        }
      </div>
    </>
  );
}
