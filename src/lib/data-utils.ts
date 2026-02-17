import {
  usePaginatedQuery,
  useQuery as useQueryWithStatus,
} from "convex-helpers/react";
import {
  OptionalRestArgsOrSkip,
  PaginatedQueryArgs,
  PaginatedQueryReference,
  useConvexAuth,
  useMutation as useConvexMutation,
  useAction as useConvexAction,
} from "convex/react";
import {
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";
import { useState } from "react";

export function useAuthenticatedQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
) {
  const { isAuthenticated } = useConvexAuth();
  return useQueryWithStatus(query, ...(isAuthenticated ? args : ["skip"]));
}

export function useUnauthenticatedQuery<
  Query extends FunctionReference<"query">,
>(query: Query, ...args: OptionalRestArgsOrSkip<Query>) {
  return useQueryWithStatus(query, ...args);
}

export function useAuthenticatedPaginatedQuery<
  Query extends PaginatedQueryReference,
>(
  query: Query,
  args: PaginatedQueryArgs<Query> | "skip",
  options: { initialNumItems: number },
) {
  const { isAuthenticated } = useConvexAuth();
  return usePaginatedQuery(query, isAuthenticated ? args : "skip", options);
}

export function useMutation<
  Mutation extends FunctionReference<"mutation">,
  Args extends OptionalRestArgs<Mutation>,
  T extends FunctionReturnType<Mutation>,
>(
  mutation: Mutation,
  opts?: {
    onSuccess?: (result: T, args: Args) => void;
    onError?: (args: Args, error: unknown) => void;
  },
) {
  const [isPending, setIsPending] = useState(false);
  const convexMutation = useConvexMutation(mutation);
  async function mutationFn(...args: Args) {
    try {
      setIsPending(true);
      const result = await convexMutation(...args);
      opts?.onSuccess?.(result, args as Args);
    } catch (error) {
      opts?.onError?.(args as Args, error);
    } finally {
      setIsPending(false);
    }
  }
  return {
    mutate: (...args: Args) => {
      mutationFn(...args);
    },
    mutateAsync: (...args: Args) => mutationFn(...args),
    isPending,
  };
}
export function useAction<
  Action extends FunctionReference<"action">,
  Args extends OptionalRestArgs<Action>,
  T extends FunctionReturnType<Action>,
>(
  action: Action,
  opts?: {
    onSuccess?: (result: T, args: Args) => void;
    onError?: (args: Args, error: unknown) => void;
  },
) {
  const [isPending, setIsPending] = useState(false);
  const convexAction = useConvexAction(action);
  async function actionFn(...args: Args) {
    try {
      setIsPending(true);
      const result = await convexAction(...args);
      opts?.onSuccess?.(result, args as Args);
    } catch (error) {
      opts?.onError?.(args as Args, error);
    } finally {
      setIsPending(false);
    }
  }
  return {
    execute: (...args: Args) => {
      actionFn(...args);
    },
    executeAsync: (...args: Args) => actionFn(...args),
    isPending,
  };
}
