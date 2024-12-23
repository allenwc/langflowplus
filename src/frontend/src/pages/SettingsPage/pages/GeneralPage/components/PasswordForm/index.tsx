import * as Form from "@radix-ui/react-form";
import InputComponent from "../../../../../../components/inputComponent";
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { t } from "i18next";

type PasswordFormComponentProps = {
  password: string;
  cnfPassword: string;
  handleInput: (event: any) => void;
  handlePatchPassword: (
    password: string,
    cnfPassword: string,
    handleInput: any,
  ) => void;
};
const PasswordFormComponent = ({
  password,
  cnfPassword,
  handleInput,
  handlePatchPassword,
}: PasswordFormComponentProps) => {
  return (
    <>
      <Form.Root
        onSubmit={(event) => {
          handlePatchPassword(password, cnfPassword, handleInput);
          event.preventDefault();
        }}
      >
        <Card x-chunk="dashboard-04-chunk-2">
          <CardHeader>
            <CardTitle>{t('pages.settings.general.password')}</CardTitle>
            <CardDescription>
              {t('pages.settings.general.password_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full gap-4">
              <Form.Field name="password" className="w-full">
                <InputComponent
                  id="pasword"
                  onChange={(value) => {
                    handleInput({ target: { name: "password", value } });
                  }}
                  value={password}
                  isForm
                  password={true}
                  placeholder={t('pages.settings.general.password_placeholder')}
                  className="w-full"
                />
                <Form.Message match="valueMissing" className="field-invalid">
                  Please enter your password
                </Form.Message>
              </Form.Field>
              <Form.Field name="cnfPassword" className="w-full">
                <InputComponent
                  id="cnfPassword"
                  onChange={(value) => {
                    handleInput({
                      target: { name: "cnfPassword", value },
                    });
                  }}
                  value={cnfPassword}
                  isForm
                  password={true}
                  placeholder={t('pages.settings.general.confirm_password_placeholder')}
                  className="w-full"
                />

                <Form.Message className="field-invalid" match="valueMissing">
                  Please confirm your password
                </Form.Message>
              </Form.Field>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Form.Submit asChild>
              <Button type="submit">{t('pages.settings.general.save')}</Button>
            </Form.Submit>
          </CardFooter>
        </Card>
      </Form.Root>
    </>
  );
};
export default PasswordFormComponent;
