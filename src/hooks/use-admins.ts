"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { inviteAdmin, listAdmins, updateAdmin } from "@/services/admins.service";
import type { UserRole, UserStatus } from "@/types";

export function useAdmins() {
  return useQuery({ queryKey: queryKeys.admins.all, queryFn: listAdmins });
}

export function useInviteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admins.all }),
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { role?: UserRole; status?: UserStatus };
    }) => updateAdmin(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admins.all }),
  });
}
