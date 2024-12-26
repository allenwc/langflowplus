import {
  useAddUser,
  useDeleteUsers,
  useGetUsers,
  useUpdateUser,
} from "@/controllers/API/queries/auth";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import IconComponent from "../../components/genericIconComponent";
import LoadingComponent from "../../components/loadingComponent";
import PaginatorComponent from "../../components/paginatorComponent";
import ShadTooltip from "../../components/shadTooltipComponent";
import { Button } from "../../components/ui/button";
import { CheckBoxDiv } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  USER_ADD_ERROR_ALERT,
  USER_ADD_SUCCESS_ALERT,
  USER_DEL_ERROR_ALERT,
  USER_DEL_SUCCESS_ALERT,
  USER_EDIT_ERROR_ALERT,
  USER_EDIT_SUCCESS_ALERT,
} from "../../constants/alerts_constants";
import {
  PAGINATION_PAGE,
  PAGINATION_ROWS_COUNT,
  PAGINATION_SIZE,
} from "../../constants/constants";
import { AuthContext } from "../../contexts/authContext";
import ConfirmationModal from "../../modals/confirmationModal";
import UserManagementModal from "../../modals/userManagementModal";
import useAlertStore from "../../stores/alertStore";
import { Users } from "../../types/api";
import { UserInputType } from "../../types/components";
import { useTranslation } from "react-i18next";

export default function AdminPage() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const [size, setPageSize] = useState(PAGINATION_SIZE);
  const [index, setPageIndex] = useState(PAGINATION_PAGE);
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const { userData } = useContext(AuthContext);
  const [totalRowsCount, setTotalRowsCount] = useState(0);

  const { mutate: mutateDeleteUser } = useDeleteUsers();
  const { mutate: mutateUpdateUser } = useUpdateUser();
  const { mutate: mutateAddUser } = useAddUser();

  const userList = useRef([]);

  useEffect(() => {
    setTimeout(() => {
      getUsers();
    }, 500);
  }, []);

  const [filterUserList, setFilterUserList] = useState(userList.current);

  const { mutate: mutateGetUsers, isPending, isIdle } = useGetUsers({});

  function getUsers() {
    mutateGetUsers(
      {
        skip: size * (index - 1),
        limit: size,
      },
      {
        onSuccess: (users) => {
          setTotalRowsCount(users["total_count"]);
          userList.current = users["users"];
          setFilterUserList(users["users"]);
        },
        onError: () => { },
      },
    );
  }

  function handleChangePagination(pageIndex: number, pageSize: number) {
    setPageSize(pageSize);
    setPageIndex(pageIndex);

    mutateGetUsers(
      {
        skip: pageSize * (pageIndex - 1),
        limit: pageSize,
      },
      {
        onSuccess: (users) => {
          setTotalRowsCount(users["total_count"]);
          userList.current = users["users"];
          setFilterUserList(users["users"]);
        },
      },
    );
  }

  function resetFilter() {
    setPageIndex(PAGINATION_PAGE);
    setPageSize(PAGINATION_SIZE);
    getUsers();
  }

  function handleFilterUsers(input: string) {
    setInputValue(input);

    if (input === "") {
      setFilterUserList(userList.current);
    } else {
      const filteredList = userList.current.filter((user: Users) =>
        user.username.toLowerCase().includes(input.toLowerCase()),
      );
      setFilterUserList(filteredList);
    }
  }

  function handleDeleteUser(user) {
    mutateDeleteUser(
      { user_id: user.id },
      {
        onSuccess: () => {
          resetFilter();
          setSuccessData({
            title: USER_DEL_SUCCESS_ALERT,
          });
        },
        onError: (error) => {
          setErrorData({
            title: USER_DEL_ERROR_ALERT,
            list: [error["response"]["data"]["detail"]],
          });
        },
      },
    );
  }

  function handleEditUser(userId, user) {
    mutateUpdateUser(
      { user_id: userId, user: user },
      {
        onSuccess: () => {
          resetFilter();
          setSuccessData({
            title: USER_EDIT_SUCCESS_ALERT,
          });
        },
        onError: (error) => {
          setErrorData({
            title: USER_EDIT_ERROR_ALERT,
            list: [error["response"]["data"]["detail"]],
          });
        },
      },
    );
  }

  function handleDisableUser(check, userId, user) {
    const userEdit = cloneDeep(user);
    userEdit.is_active = !check;

    mutateUpdateUser(
      { user_id: userId, user: userEdit },
      {
        onSuccess: () => {
          resetFilter();
          setSuccessData({
            title: USER_EDIT_SUCCESS_ALERT,
          });
        },
        onError: (error) => {
          setErrorData({
            title: USER_EDIT_ERROR_ALERT,
            list: [error["response"]["data"]["detail"]],
          });
        },
      },
    );
  }

  function handleSuperUserEdit(check, userId, user) {
    const userEdit = cloneDeep(user);
    userEdit.is_superuser = !check;

    mutateUpdateUser(
      { user_id: userId, user: userEdit },
      {
        onSuccess: () => {
          resetFilter();
          setSuccessData({
            title: USER_EDIT_SUCCESS_ALERT,
          });
        },
        onError: (error) => {
          setErrorData({
            title: USER_EDIT_ERROR_ALERT,
            list: [error["response"]["data"]["detail"]],
          });
        },
      },
    );
  }

  function handleNewUser(user: UserInputType) {
    mutateAddUser(user, {
      onSuccess: (res) => {
        mutateUpdateUser(
          {
            user_id: res["id"],
            user: {
              is_active: user.is_active,
              is_superuser: user.is_superuser,
            },
          },
          {
            onSuccess: () => {
              resetFilter();
              setSuccessData({
                title: USER_ADD_SUCCESS_ALERT,
              });
            },
            onError: (error) => {
              setErrorData({
                title: USER_ADD_ERROR_ALERT,
                list: [error["response"]["data"]["detail"]],
              });
            },
          },
        );
      },
      onError: (error) => {
        setErrorData({
          title: USER_ADD_ERROR_ALERT,
          list: [error["response"]["data"]["detail"]],
        });
      },
    });
  }

  return (
    <>
      {userData && (
        <div className="admin-page-panel flex h-full flex-col pb-8">
          <div className="main-page-nav-arrangement">
            <span className="main-page-nav-title">
              <IconComponent name="Shield" className="w-6" />
              {t("pages.admin.title")}
            </span>
          </div>
          <span className="admin-page-description-text">
            {t("pages.admin.description")}
          </span>
          <div className="flex w-full justify-between px-4">
            <div className="flex w-96 items-center gap-4">
              <Input
                placeholder={t("pages.admin.search_username")}
                value={inputValue}
                onChange={(e) => handleFilterUsers(e.target.value)}
              />
              {inputValue.length > 0 ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setInputValue("");
                    setFilterUserList(userList.current);
                  }}
                >
                  <IconComponent name="X" className="w-6 text-foreground" />
                </div>
              ) : (
                <div>
                  <IconComponent
                    name="Search"
                    className="w-6 text-foreground"
                  />
                </div>
              )}
            </div>
            <div>
              <UserManagementModal
                title={t("pages.admin.modal_new_title")}
                titleHeader={t("pages.admin.modal_new_title_header")}
                cancelText={t("pages.admin.modal_cancel_text")}
                confirmationText={t("pages.admin.modal_confirmation_text")}
                icon={"UserPlus2"}
                onConfirm={(index, user) => {
                  handleNewUser(user);
                }}
                asChild
              >
                <Button variant="primary">{t("pages.admin.new_user")}</Button>
              </UserManagementModal>
            </div>
          </div>
          {isPending || isIdle ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoadingComponent remSize={12} />
            </div>
          ) : userList.current.length === 0 && !isIdle ? (
            <>
              <div className="m-4 flex items-center justify-between text-sm">
                No users registered.
              </div>
            </>
          ) : (
            <>
              <div
                className={
                  "m-4 h-fit overflow-x-hidden overflow-y-scroll rounded-md border-2 bg-background custom-scroll" +
                  (isPending ? " border-0" : "")
                }
              >
                <Table className={"table-fixed outline-1"}>
                  <TableHeader
                    className={
                      isPending ? "hidden" : "table-fixed bg-muted outline-1"
                    }
                  >
                    <TableRow>
                      <TableHead className="h-10">Id</TableHead>
                      <TableHead className="h-10">
                        {t("pages.admin.grid_username")}
                      </TableHead>
                      <TableHead className="h-10">
                        {t("pages.admin.grid_active")}
                      </TableHead>
                      <TableHead className="h-10">
                        {t("pages.admin.grid_superuser")}
                      </TableHead>
                      <TableHead className="h-10">
                        {t("pages.admin.grid_created_at")}
                      </TableHead>
                      <TableHead className="h-10">
                        {t("pages.admin.grid_updated_at")}
                      </TableHead>
                      <TableHead className="h-10 w-[100px] text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  {!isPending && (
                    <TableBody>
                      {filterUserList.map((user: UserInputType, index) => (
                        <TableRow key={index}>
                          <TableCell className="truncate py-2 font-medium">
                            <ShadTooltip content={user.id}>
                              <span className="cursor-default">{user.id}</span>
                            </ShadTooltip>
                          </TableCell>
                          <TableCell className="truncate py-2">
                            <ShadTooltip content={user.username}>
                              <span className="cursor-default">
                                {user.username}
                              </span>
                            </ShadTooltip>
                          </TableCell>
                          <TableCell className="relative left-1 truncate py-2 text-align-last-left">
                            <ConfirmationModal
                              size="x-small"
                              title={t("pages.admin.modal_edit_title")}
                              titleHeader={`${user.username}`}
                              modalContentTitle={t("pages.admin.modal_attention")}
                              cancelText={t("pages.admin.modal_cancel_text")}
                              confirmationText={t("pages.admin.modal_confirmation_text")}
                              icon={"UserCog2"}
                              data={user}
                              index={index}
                              onConfirm={(index, user) => {
                                handleDisableUser(
                                  user.is_active,
                                  user.id,
                                  user,
                                );
                              }}
                            >
                              <ConfirmationModal.Content>
                                <span>
                                  {t("pages.admin.modal_confirmation_content")}
                                </span>
                              </ConfirmationModal.Content>
                              <ConfirmationModal.Trigger>
                                <div className="flex w-fit">
                                  <CheckBoxDiv checked={user.is_active} />
                                </div>
                              </ConfirmationModal.Trigger>
                            </ConfirmationModal>
                          </TableCell>
                          <TableCell className="relative left-1 truncate py-2 text-align-last-left">
                            <ConfirmationModal
                              size="x-small"
                              title={t("pages.admin.modal_edit_title")}
                              titleHeader={`${user.username}`}
                              modalContentTitle={t("pages.admin.modal_attention")}
                              cancelText={t("pages.admin.modal_cancel_text")}
                              confirmationText={t("pages.admin.modal_confirmation_text")}
                              icon={"UserCog2"}
                              data={user}
                              index={index}
                              onConfirm={(index, user) => {
                                handleSuperUserEdit(
                                  user.is_superuser,
                                  user.id,
                                  user,
                                );
                              }}
                            >
                              <ConfirmationModal.Content>
                                <span>
                                  {t("pages.admin.modal_confirmation_content")}
                                </span>
                              </ConfirmationModal.Content>
                              <ConfirmationModal.Trigger>
                                <div className="flex w-fit">
                                  <CheckBoxDiv checked={user.is_superuser} />
                                </div>
                              </ConfirmationModal.Trigger>
                            </ConfirmationModal>
                          </TableCell>
                          <TableCell className="truncate py-2">
                            {
                              new Date(user.create_at!)
                                .toISOString()
                                .split("T")[0]
                            }
                          </TableCell>
                          <TableCell className="truncate py-2">
                            {
                              new Date(user.updated_at!)
                                .toISOString()
                                .split("T")[0]
                            }
                          </TableCell>
                          <TableCell className="flex w-[100px] py-2 text-right">
                            <div className="flex">
                              <UserManagementModal
                                title={t("pages.admin.modal_edit_title")}
                                titleHeader={`${user.id}`}
                                cancelText={t("pages.admin.modal_cancel_text")}
                                confirmationText={t("pages.admin.modal_confirmation_text")}
                                icon={"UserCog2"}
                                data={user}
                                index={index}
                                onConfirm={(index, editUser) => {
                                  handleEditUser(user.id, editUser);
                                }}
                              >
                                <ShadTooltip content={t("pages.admin.modal_edit_title")} side="top">
                                  <IconComponent
                                    name="Pencil"
                                    className="h-4 w-4 cursor-pointer"
                                  />
                                </ShadTooltip>
                              </UserManagementModal>

                              <ConfirmationModal
                                size="x-small"
                                title={t("pages.admin.modal_delete_title")}
                                titleHeader={t("pages.admin.modal_delete_title_header")}
                                modalContentTitle={t("pages.admin.modal_attention")}
                                cancelText={t("pages.admin.modal_cancel_text")}
                                confirmationText={t("pages.admin.modal_confirmation_text")}
                                icon={"UserMinus2"}
                                data={user}
                                index={index}
                                onConfirm={(index, user) => {
                                  handleDeleteUser(user);
                                }}
                              >
                                <ConfirmationModal.Content>
                                  <span>
                                    {t("pages.admin.modal_delete_content")}
                                  </span>
                                </ConfirmationModal.Content>
                                <ConfirmationModal.Trigger>
                                  <IconComponent
                                    name="Trash2"
                                    className="ml-2 h-4 w-4 cursor-pointer"
                                  />
                                </ConfirmationModal.Trigger>
                              </ConfirmationModal>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </div>

              <PaginatorComponent
                pageIndex={index}
                pageSize={size}
                totalRowsCount={totalRowsCount}
                paginate={handleChangePagination}
                rowsCount={PAGINATION_ROWS_COUNT}
              ></PaginatorComponent>
            </>
          )}
        </div>
      )}
    </>
  );
}
