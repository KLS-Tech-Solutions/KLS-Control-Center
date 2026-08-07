"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { queryKeys } from "@/lib/query-keys";
import { getSession, login, logout } from "@/services/auth.service";
import { can, type Capability } from "@/types";

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/** Convenience wrapper so screens read `useCan("manageCatalogue")`. */
export function useCan(capability: Capability): boolean {
  const { data: user } = useSession();
  return can(user?.role, capability);
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: { email: string; password: string }) => login(values),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.session, user);
      router.push("/");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}
