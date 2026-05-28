import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

// Role hierarchy: SUPER_ADMIN > ADMIN > EDITOR > PENULIS > KONTRIBUTOR
const roleHierarchy: Record<Role, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  EDITOR: 3,
  PENULIS: 2,
  KONTRIBUTOR: 1,
};

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Get current session and check if user has minimum required role.
 * Returns session or throws unauthorized response.
 */
export async function requireAuth(minRole?: Role) {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }

  if (!session.user.isActive) {
    return { error: NextResponse.json({ error: "Akun dinonaktifkan" }, { status: 403 }), session: null };
  }

  if (minRole && !hasMinRole(session.user.role, minRole)) {
    return { error: NextResponse.json({ error: "Akses ditolak" }, { status: 403 }), session: null };
  }

  return { error: null, session };
}

/**
 * Permission checks for specific actions
 */
export const permissions = {
  // Article permissions
  canCreateArticle: (role: Role) => hasMinRole(role, "KONTRIBUTOR"),
  canEditOwnArticle: (role: Role) => hasMinRole(role, "KONTRIBUTOR"),
  canEditAnyArticle: (role: Role) => hasMinRole(role, "EDITOR"),
  canPublishArticle: (role: Role) => hasMinRole(role, "EDITOR"),
  canDeleteArticle: (role: Role) => hasMinRole(role, "ADMIN"),

  // Category permissions
  canManageCategories: (role: Role) => hasMinRole(role, "ADMIN"),

  // Media permissions
  canUploadMedia: (role: Role) => hasMinRole(role, "KONTRIBUTOR"),
  canDeleteAnyMedia: (role: Role) => hasMinRole(role, "ADMIN"),

  // Ads permissions
  canManageAds: (role: Role) => hasMinRole(role, "ADMIN"),

  // User permissions
  canManageUsers: (role: Role) => hasMinRole(role, "SUPER_ADMIN"),

  // Settings permissions
  canManageSettings: (role: Role) => hasMinRole(role, "SUPER_ADMIN"),
  canManageLayout: (role: Role) => hasMinRole(role, "ADMIN"),
  canManageSEO: (role: Role) => hasMinRole(role, "ADMIN"),
  canManageMenus: (role: Role) => hasMinRole(role, "ADMIN"),
};
