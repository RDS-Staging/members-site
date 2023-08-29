import {
  useGetMembersQuery,
  useUpdateMemberRoleMutation,
  useArchiveMemberMutation,
} from "../../services/serverApi";
import { Provider } from "react-redux";
import { store } from "../../store/index";

import React, { PropsWithChildren } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { setupServer } from "msw/node";
import { handlers } from "../../mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function Wrapper({
  children,
}: PropsWithChildren<Record<string, any>>): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

describe("it shoud test all the members RTK query hooks", () => {
  test("returns members", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGetMembersQuery(),
      { wrapper: Wrapper }
    );

    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await act(() => waitForNextUpdate());

    const nextResponse = result.current;
    expect(nextResponse?.data).not.toBeUndefined();
    expect(nextResponse?.data?.message).toBe("Members returned successfully!");
    expect(nextResponse?.data?.members).toHaveLength(3);
  });

  test("it should promote user to member", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useUpdateMemberRoleMutation(),
      {
        wrapper: Wrapper,
      }
    );

    const [updateMemberRole, initialResponse] = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(false);

    act(() => {
      void updateMemberRole({
        username: "vinayak",
      });
    });

    const loadingResponse = result.current[1];
    expect(loadingResponse.data).toBeUndefined();
    expect(loadingResponse.isLoading).toBe(true);

    await waitForNextUpdate();

    const loadedResponse = result.current[1];
    expect(loadedResponse.isLoading).toBe(false);
    expect(loadedResponse.isSuccess).toBe(true);
  });

  test("it should archive member", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useArchiveMemberMutation(),
      {
        wrapper: Wrapper,
      }
    );

    const [archieveMemberMutation, initialResponse] = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(false);

    act(() => {
      void archieveMemberMutation({
        username: "vinayak",
      });
    });

    const loadingResponse = result.current[1];
    expect(loadingResponse.data).toBeUndefined();
    expect(loadingResponse.isLoading).toBe(true);

    await waitForNextUpdate();

    const loadedResponse = result.current[1];
    expect(loadedResponse.isLoading).toBe(false);
    expect(loadedResponse.isSuccess).toBe(true);
  });
});
